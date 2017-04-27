const request = require('request-promise-native')
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root
const QuestionModel = require('../model/question')
const DataModel = require('../model/data')

module.exports = {
  async get (page, size) {
    const cond = {
      isDeleted: false
    }
    let qs = await QuestionModel
                              .find(cond)
                              .sort({createTime: -1})
                              .skip((page - 1) * size)
                              .limit(size)
                              .lean()
                              .exec()
    const data2 = [1, 2, 3, 4]
    console.log(typeof (data2))
    // qs = qs.toArray()
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
    const { title, data } = await this.getData(qid)
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
  },
  async getData (qid) {
    const rs = await request(`${zhihuRoot}/question/${qid}`).catch(err => {
      return err
    })
    if (rs.error) {
      return {
        success: false,
        rs: rs,
        url: `${zhihuRoot}/question/${qid}`
      }
    }
    const $ = cheerio.load(rs)
    const NumberBoard = $('.NumberBoard-item .NumberBoard-value')
    return {
      title: $('.QuestionHeader-title').text(),
      data: {
        qid: qid,
        followers: Number($(NumberBoard[0]).text()),
        readers: Number($(NumberBoard[1]).text()),
        answers: Number($('h4.List-headerText span').text().replace(' 个回答', ''))
      }
    }
  }
}
