const request = require('request-promise-native')
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async getData (qid) {
    const rs = await request(`${zhihuRoot}/question/${qid}`).catch(err => {
      return err
    })
    if (rs.error) {
      return {
        success: false,
        status: rs.statusCode,
        msg: rs.message
      }
    }
    const $ = cheerio.load(rs)
    const NumberBoard = $('.NumberBoard-item .NumberBoard-value')
    return {
      success: true,
      title: $('.QuestionHeader-title').text(),
      data: {
        qid: qid,
        followers: Number($(NumberBoard[0]).text()),
        readers: Number($(NumberBoard[1]).text()),
        answers: Number($('h4.List-headerText span').text().replace(' 个回答', ''))
      }
    }
  }
  // async explore () {}
}
