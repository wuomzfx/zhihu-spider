const request = require('request-promise-native')
const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

// const getQues = async (ques) => {
//   const promises = ques.map(q => {
//     return request(`${zhihuRoot}${q.url}`).then(rs => {
//       const $ = cheerio.load(rs)
//       const NumberBoard = $('.NumberBoard-item .NumberBoard-value')
//       q.followers = $(NumberBoard[0]).text()
//       q.readers = $(NumberBoard[1]).text()
//       q.answers = $('h4.List-headerText span').text().replace(' 个回答', '')
//     })
//   })
//   await Promise.all(promises)
// }

module.exports = {
  index (ctx) {
    ctx.body = '这是首页'
  },
  async spider (ctx) {
    const rs = await request(`${zhihuRoot}/explore`).catch(err => {
      return err
    })
    if (rs.error) {
      ctx.body = rs.message
      return
    }
    const $ = cheerio.load(rs)
    let ques = []
    $('#js-explore-tab h2 a').each((k, v) => {
      // if (k > 0) return
      ques.push({
        title: $(v).text().replace(/\n/g, ''),
        url: $(v).attr('href').split('/answer')[0]
      })
    })
    const Question = ctx.model('question')
    const question = new Question(ques[0])
    await question.save()
    ctx.body = ques
  }
}
