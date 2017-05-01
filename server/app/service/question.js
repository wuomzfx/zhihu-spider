const spider = require('./spider')
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
  async add (qid) {
    const rs = await spider.getData(qid)
    if (!rs.success) {
      return rs
    }
    const { title, data } = rs
    const question = {
      qid: qid,
      title: title
    }
    const q = new QuestionModel(question)
    const d = new DataModel(data)
    try {
      let question = await q.save()
      question = question.toObject()
      const qData = await d.save()
      question.data = qData
      return {
        success: true,
        question
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
  async explore (offset = 0, type = 'day') {
    const data = await spider.explore(offset)
    if (!data.success) {
      return data
    }
    const qs = await QuestionModel.find({
      qid: {$in: data.qids}
    }).exec()
    const qsMap = {}
    qs.forEach(q => {
      qsMap[q.qid] = q.status
    })
    data.questions.forEach(q => {
      if (qsMap[q.qid]) {
        q.status = qsMap[q.qid]
      }
    })
    return data
  }
}
