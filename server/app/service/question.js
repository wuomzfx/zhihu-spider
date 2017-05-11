const spiderService = require('./spider')
const QuestionModel = require('../model/question')
const DataModel = require('../model/data')

module.exports = {
  async get (page, size, cond = {}) {
    cond.isDeleted = cond.isDeleted | false
    const qs = await QuestionModel
                              .find(cond)
                              .sort({createTime: -1})
                              .skip((page - 1) * size)
                              .limit(size)
                              .lean()
                              .exec()
    const qids = qs.map(q => q.qid)
    const data = await DataModel.aggregate([
      { $match: {
        qid: {$in: qids}
      }},
      { $sort: {createTime: -1} },
      { $group: {
        _id: '$qid',
        followers: {$first: '$followers'},
        readers: {$first: '$readers'},
        answers: {$first: '$answers'},
        createTime: {$first: '$createTime'}
      }}
    ]).exec()
    const dataMap = {}
    data.forEach(d => {
      dataMap[d._id] = d
    })
    qs.forEach((q, k) => {
      q.data = dataMap[q.qid]
    })
    return qs
  },
  async add (authInfo, qid) {
    const rs = await spiderService.getData(authInfo.cookie, qid)
    if (!rs.success) {
      return rs
    }
    const { title, data } = rs
    if (!title || data.readers <= 0) {
      return {
        success: false,
        status: 500,
        msg: '爬取失败'
      }
    }
    const question = {
      qid: qid,
      userId: authInfo._id,
      title: title
    }
    const q = new QuestionModel(question)
    const d = new DataModel(data)
    try {
      const que = (await q.save()).toObject()
      const qData = await d.save()
      que.data = qData
      return {
        success: true,
        question: que
      }
    } catch (err) {
      return {
        success: false,
        status: 500,
        msg: err.errmsg
      }
    }
  },
  async stop (qid) {
    return QuestionModel.findOne({
      qid: qid
    }).update({
      status: 0,
      updateTime: new Date()
    })
  },
  async reActive (qid) {
    return QuestionModel.findOne({
      qid: qid
    }).update({
      status: 1,
      updateTime: new Date(),
      expiredTime: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
    })
  },
  async richQuestions (data, userId) {
    const qs = await QuestionModel.find({
      userId: userId,
      qid: {$in: data.qids}
    }).exec()
    const qsMap = {}
    qs.forEach(q => {
      qsMap[q.qid] = q
    })
    data.questions.forEach(q => {
      q.status = 0
      if (qsMap[q.qid]) {
        q.status = qsMap[q.qid].status
        q._id = qsMap[q.qid]._id
      }
    })
    return data
  },
  async search (authInfo, params) {
    const data = await spiderService.search(authInfo.cookie, params)
    if (!data.success) {
      return data
    }
    return this.richQuestions(data, authInfo._id)
  },
  async explore (authInfo, offset = 0, type = 'day') {
    const data = await spiderService.explore(authInfo.cookie, offset)
    if (!data.success) {
      return data
    }
    return this.richQuestions(data, authInfo._id)
  }
}
