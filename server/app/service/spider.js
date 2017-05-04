const request = require('request-promise-native')
// request = request.defaults({'proxy': 'http://127.0.0.1:1080'})// 走本地代理做测试
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root
const getQidByUrl = (url) => {
  try {
    const reg = /question\/(\d*)/
    return url.match(reg)[1]
  } catch (err) {
    return false
  }
}
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
    if (rs.indexOf('访问频次过快') >= 0) {
      return {
        success: false,
        status: 500,
        msg: 'IP被限'
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
  },
  async explore (offset = 0, type = 'day') {
    const params = JSON.stringify({
      offset: offset,
      type: type
    })
    const options = {
      // headers: {
      //   'Accept-Encoding': 'deflate, sdch, br' // 不允许gzip,开启gzip会开启知乎客户端渲染，导致无法爬取
      // },
      url: `${zhihuRoot}/node/ExploreAnswerListV2?params=${params}`
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
    const dataArr = []
    const qids = []
    $('.explore-feed.feed-item').each((k, el) => {
      const $el = $(el)
      const titleEl = $el.find('h2 a.question_link')
      const qid = getQidByUrl(titleEl.attr('href'))
      if (!qid) return
      const summary = $el.find('.summary')
      summary.find('img').remove()
      summary.find('.toggle-expand').remove()
      const answer = summary.html()
      const title = titleEl.text()
      qids.push(qid)
      dataArr.push({
        qid: qid,
        title: title,
        aid: $el.find('.zm-item-answer').data('atoken'),
        answer: answer,
        voters: $el.find('.js-voteCount').text(),
        comments: $el.find('.js-toggleCommentBox').text().replace(' 条评论', '')
      })
    })
    // 并发太高，有问题
    // const promises = $('.explore-feed.feed-item').map((k, el) => {
    //   const qurl = $(el).find('h2 a').attr('href')
    //   const qid = getQidByUrl(qurl)
    //   return this.getData(qid).then(rs => {
    //     if (rs.success && rs.data.readers > 0) {
    //       rs.status = 0
    //       rs.qid = qid
    //       qids.push(qid)
    //       dataArr.push(rs)
    //     }
    //   })
    // }).get()
    // await Promise.all(promises)
    return {
      success: true,
      qids: qids,
      questions: dataArr
    }
  }
}
