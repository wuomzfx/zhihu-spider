const request = require('request-promise-native')
// const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async add (qid) {
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
    return rs
  }
}
