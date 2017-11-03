const request = require('request-promise-native')
// request = request.defaults({'proxy': 'http://127.0.0.1:1080'})// 走本地代理做测试
const querystring = require('querystring')
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
  request (options) {
    return request(options).catch(err => {
      return err
    })
  },
  getQueByHtml ($, $title) {
    const qid = getQidByUrl($title.attr('href'))
    const aid = $('meta[itemprop="answer-url-token"]').attr('content')
    const $summary = $('.summary')
    $summary.find('.toggle-expand').remove()
    $summary.find('img').remove()
    const comments = $('.js-toggleCommentBox').text().replace(' 条评论', '').replace(/\n/g, '')
    return {
      qid: qid,
      title: $title.text().replace(/\n/g, ''),
      aid: aid,
      answer: ($summary.html() || '').replace(/\n/g, ''),
      voters: $('.js-vote-count').text(),
      comments: comments === '添加评论' ? 0 : comments,
      timestamp: $('.feed-item').data('score')
    }
  },
  async getTopicToken (cookie, topicId) {
    // const options = {
    //   url: `${zhihuRoot}/topic/${topicId}/hot`,
    //   method: 'GET',
    //   headers: {
    //     'Cookie': cookie
    //   }
    // }
    // let res
    // let rs = await request(options).on('response', function (response) {
    //   res = response
    // }).catch(err => {
    //   return err
    // })
    // if (rs.error) {
    //   return this.failRequest(rs)
    // }
    // const $ = cheerio.load(rs)
    // const cookieData = authService.buildCookie(res.headers['set-cookie'])
    // return {
    //   success: true,
    //   token: $('input[name=_xsrf]').val(),
    //   cookie: cookieData.data
    // }
  },
  async getTopicHot (cookie, topicId, offset) {
    const options = {
      url: `https://www.zhihu.com/node/TopicFeedList`,
      method: 'POST',
      headers: {
        // 'Cookie': cookie
      },
      formData: {
        method: 'next',
        params: `{"offset":${offset},"topic_id":${topicId},"feed_type":"timeline_feed"}`
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const qids = []
    const questions = []
    JSON.parse(rs).msg.forEach(html => {
      const $ = cheerio.load(html)
      const $title = $('.question_link')
      const r = this.getQueByHtml($, $title)
      qids.push(r.qid)
      questions.push(r)
    })
    return {
      success: true,
      qids: qids,
      questions: questions
    }
  },
  async getTopics (auth) {
    const options = {
      url: `${zhihuRoot}/topic`,
      method: 'GET',
      headers: {
        'Cookie': auth.cookie
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const $ = cheerio.load(rs)
    const topics = []
    $('.zm-topic-cat-item').each((k, topic) => {
      topics.push({
        topicId: $(topic).data('id'),
        urlToken: Number($(topic).data('href').replace('/topic/', '')),
        name: $(topic).text()
      })
    })
    return {
      success: true,
      topics: topics
    }
  },
  async getTopicsByApi (auth) {
    const options = {
      url: `${zhihuRoot}/followed_topics?offset=0&limit=100`,
      method: 'GET',
      headers: {
        'Cookie': auth.cookie
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const { payload = [] } = JSON.parse(rs)
    return {
      success: true,
      topics: payload.map(t => ({
        topicId: t.id,
        urlToken: Number(t.url_token),
        name: t.name
      }))
    }
  },
  failRequest (rs) {
    return {
      success: false,
      status: rs.statusCode,
      msg: rs.message
    }
  },
  async getUserInfo (cookie) {
    const options = {
      url: `${zhihuRoot}/people/edit`,
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const $ = cheerio.load(rs)
    const judge = this.judgeLoad($)
    if (!judge.success) {
      return judge
    }
    const data = $('#data').data('state')
    const userInfo = data.entities.users[data.currentUser]
    return {
      success: true,
      data: {
        urlToken: data.currentUser,
        name: userInfo.name,
        uid: userInfo.uid
      }
    }
  },
  encode (params) {
    return querystring.stringify(params, null, null, {
      encodeURIComponent: encodeURIComponent
    })
  },
  async search (cookie, data) {
    const query = this.encode(data)
    const options = {
      url: `${zhihuRoot}/r/search?${query}`,
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const qids = []
    const questions = []
    JSON.parse(rs).htmls.filter(html => {
      if (html.indexOf('data-type="Answer"') > 0) {
        const $ = cheerio.load(html)
        const $title = $('.title a')
        const r = this.getQueByHtml($, $title)
        qids.push(r.qid)
        questions.push(r)
      }
    })
    return {
      success: true,
      qids: qids,
      questions: questions
    }
  },
  async quickSearch (cookie, token) {
    const query = this.encode({
      token: token,
      max_matches: 10,
      use_similar: 0
    })
    const options = {
      url: `${zhihuRoot}/autocomplete?${query}`,
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'Accept-Encoding': 'deflate, sdch, br'
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    } else {
      return {
        success: true,
        data: rs
      }
    }
  },
  async profile (cookie) {
    const options = {
      url: `https://www.zhihu.com/`,
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'Accept-Encoding': 'deflate, sdch, br'
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    return {
      success: true,
      data: rs
    }
  },
  judgeLoad ($) {
    if ($('#error').length) {
      return {
        success: false,
        status: 500,
        msg: 'IP被限'
      }
    } else {
      return {
        success: true
      }
    }
  },
  getCaptcha (cb) {
    const time = Date.now()
    const options = {
      encoding: null,
      method: 'GET',
      url: `${zhihuRoot}/captcha.gif?r=${time}&type=login`
    }
    return request(options, (err, res, body) => {
      cb(err, res, body)
    })
  },
  async initLogin () {
    const options = {
      // url: `http://www.baidu.com`
      url: `${zhihuRoot}/#signin`
    }
    let res
    const rs = await request(options).on('response', function (response) {
      res = response
    }).catch(err => {
      return err
    })
    if (rs.error) {
      return this.failRequest(rs)
    }
    const $ = cheerio.load(rs)
    const judge = this.judgeLoad($)
    if (!judge.success) {
      return judge
    }
    return {
      headers: res.headers,
      data: {
        xsrf: $('input[name=_xsrf]').val()
      },
      success: true
    }
  },
  async getQuesData (cookie, qids) {
    const data = qids.map(qid => {
      return this.getData(cookie, qid)
    })
    return Promise.all(data)
  },
  async getData (cookie, qid) {
    const options = {
      url: `${zhihuRoot}/question/${qid}`,
      method: 'GET',
      headers: {
        'Cookie': cookie,
        'Accept-Encoding': 'deflate, sdch, br' // 不允许gzip,开启gzip会开启知乎客户端渲染，导致无法爬取
      }
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const $ = cheerio.load(rs)
    const judge = this.judgeLoad($)
    if (!judge.success) {
      return judge
    }
    const NumberBoard = $('.NumberBoard-item .NumberBoard-value')
    const $title = $('.QuestionHeader-title')
    $title.find('button').remove()
    return {
      success: true,
      title: $title.text(),
      data: {
        qid: qid,
        followers: Number($(NumberBoard[0]).text()),
        readers: Number($(NumberBoard[1]).text()),
        answers: Number($('h4.List-headerText span').text().replace(' 个回答', ''))
      }
    }
  },
  async explore (cookie, offset = 0, type = 'day') {
    const params = JSON.stringify({
      offset: offset,
      type: type
    })
    const options = {
      headers: {
        'Cookie': cookie
      },
      method: 'GET',
      url: `${zhihuRoot}/node/ExploreAnswerListV2?params=${params}`
    }
    const rs = await this.request(options)
    if (rs.error) {
      return this.failRequest(rs)
    }
    const $ = cheerio.load(rs)
    const judge = this.judgeLoad($)
    if (!judge.success) {
      return judge
    }
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
    return {
      success: true,
      qids: qids,
      questions: dataArr
    }
  }
}
