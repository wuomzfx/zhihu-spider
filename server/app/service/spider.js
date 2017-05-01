const request = require('request-promise-native')
// request = request.defaults({'proxy': 'http://127.0.0.1:1080'})//走本地代理做测试
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async getData (qid) {
    const options = {
      url: `${zhihuRoot}/question/${qid}`,
      headers: {
        'Accept-Encoding': 'deflate, sdch, br' // 不允许gzip,开启gzip会开启知乎客户端渲染，导致无法爬取
      }
    }
    const rs = await request(options).catch(err => {
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
