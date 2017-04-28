const spider = require('./spider')
const QuestionModel = require('../model/question')
const DataModel = require('../model/data')

module.exports = {
  async get (page, size) {
    const cond = {
      isDeleted: false
    }
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
    // qqq = JSON.parse(JSON.stringify(qs))
    qs.forEach((q, k) => {
      q.data = dataMap[q.qid]
      // console.log(q.data)
    })
    return qs
  },
  async add (qid) {
    const { title, data } = await spider.getData(qid)
    const question = {
      qid: qid,
      title: title
    }
    const q = new QuestionModel(question)
    const d = new DataModel(data)
    try {
      await d.save()
      await q.save()
      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        msg: err
      }
    }
  }
}
