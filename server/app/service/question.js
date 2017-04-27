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
    const qs = await QuestionModel
                              .find(cond)
                              .sort({createTime: -1})
                              .skip((page - 1) * size)
                              .limit(size)
                              .exec()
    const qids = qs.map(q => q.qid)
    const data = await DataModel.find({
      'qid': {$in: qids}
    }).exec()
    return {
      qids: qids,
      questions: qs,
      data: data
    }
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
