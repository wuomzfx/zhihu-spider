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
  async login () {
    const options = {
      url: `${zhihuRoot}`,
      headers: {
        'Cookie': '_zap=f1f6cc2a-bec1-4412-874a-08089b6379b5; d_c0="ACBC15FASwuPTljKEfJvYMJGKzEG1k97A5E=|1486808652"; q_c1=02197dc25c87496aa441813616efdc4d|1492326814000|1486808651000; _xsrf=ef372450cc47dfd1347c84f7c50199bb; infinity_uid="2|1:0|10:1493527262|12:infinity_uid|24:ODM4NDkyNTQwMzAxODgxMzQ0|05007aa8335b459e15bba0feff5c1828e3f6ef4725c78cfaffde325449ad795b"; r_cap_id="OGRlZWRlZWE4MzlkNDVkZTkyOTg3NjM2ZjFmN2MxZTU=|1493620337|cedadab04faab0efa022a99a01d5800f23ca6f90"; cap_id="YjcwZjYxZmVjODc0NGM4NGEwNzE4YmM5ZTRlOTIxYWM=|1493620337|a8073da175ce51fab33e3e9cf9c1325189a38f3e"; aliyungf_tc=AQAAABME4G9kyQIAzbYYJKktTjN+w3X6; acw_tc=AQAAAOKv8TRgFAUAzbYYJMMMqX0Qv513; __utmt=1; __utma=51854390.625280769.1493618021.1493812935.1493910209.5; __utmb=51854390.2.10.1493910209; __utmc=51854390; __utmz=51854390.1493618021.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=51854390.100-1|2=registration_date=20140713=1^3=entry_date=20140713=1; z_c0=Mi4wQUFCQXp0b3lBQUFBSUVMWGtVQkxDeGNBQUFCaEFsVk42R011V1FEcEFHazR4VnZwbVAwa0VFMzlEd2MyMEhpNmZ3|1493910156|ae8dadf774b2910246a097dd5adb308d3dec26d3'
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
    return rs
  },
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
    if ($('#error').length) {
      return {
        success: false,
        status: 500,
        msg: 'IP被限'
      }
    }
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
      headers: {
        'Cookie': '_zap=f1f6cc2a-bec1-4412-874a-08089b6379b5; d_c0="ACBC15FASwuPTljKEfJvYMJGKzEG1k97A5E=|1486808652"; q_c1=02197dc25c87496aa441813616efdc4d|1492326814000|1486808651000; _xsrf=ef372450cc47dfd1347c84f7c50199bb; infinity_uid="2|1:0|10:1493527262|12:infinity_uid|24:ODM4NDkyNTQwMzAxODgxMzQ0|05007aa8335b459e15bba0feff5c1828e3f6ef4725c78cfaffde325449ad795b"; r_cap_id="OGRlZWRlZWE4MzlkNDVkZTkyOTg3NjM2ZjFmN2MxZTU=|1493620337|cedadab04faab0efa022a99a01d5800f23ca6f90"; cap_id="YjcwZjYxZmVjODc0NGM4NGEwNzE4YmM5ZTRlOTIxYWM=|1493620337|a8073da175ce51fab33e3e9cf9c1325189a38f3e"; aliyungf_tc=AQAAABME4G9kyQIAzbYYJKktTjN+w3X6; acw_tc=AQAAAOKv8TRgFAUAzbYYJMMMqX0Qv513; __utmt=1; __utma=51854390.625280769.1493618021.1493812935.1493910209.5; __utmb=51854390.2.10.1493910209; __utmc=51854390; __utmz=51854390.1493618021.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=51854390.100-1|2=registration_date=20140713=1^3=entry_date=20140713=1; z_c0=Mi4wQUFCQXp0b3lBQUFBSUVMWGtVQkxDeGNBQUFCaEFsVk42R011V1FEcEFHazR4VnZwbVAwa0VFMzlEd2MyMEhpNmZ3|1493910156|ae8dadf774b2910246a097dd5adb308d3dec26d3'
      },
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
    if ($('#error').length) {
      return {
        success: false,
        status: 500,
        msg: 'IP被限'
      }
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
