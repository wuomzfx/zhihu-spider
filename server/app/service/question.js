const request = require('request-promise-native')
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async add (ctx, qid) {
    const { title } = await this.getData(qid)
    const question = {
      qid: qid,
      title: title
    }
    console.log('123123')
    console.log(ctx.model('question'))
    const Q = ctx.model('question')
    // console.log(Q)
    const q = new Q(question)
    await q.save()
    return title
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
