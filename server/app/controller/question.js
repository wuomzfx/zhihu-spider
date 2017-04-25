const request = require('request-promise-native')
// const cheerio = require('cheerio')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async create (ctx) {
    const { url, title } = ctx.request.body
    if (!url && !title) {
      ctx.body = '别瞎填'
    }
    if (url) {
      const rs = await request(`${zhihuRoot}/explore`).catch(err => {
        return err
      })
      if (rs.error) {
        ctx.body = rs.message
        return
      }
      ctx.body = rs
    } else {
      ctx.body = title
    }
  }
}
