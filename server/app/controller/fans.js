const spider = require('../service/spider')
const fansService = require('../service/fans')
const App = require('./app')

class Fans extends App {
  async get (ctx) {
    const { query, sort } = ctx.request.body
    super.success(await fansService.get(query, sort))
    // ctx.body = await spider.getFansData(ctx.authInfo.cookie, 'chi-ruo-28')
  }
  async build (ctx) {
    await fansService.drop()
    let [offset, limit] = [0, 20]
    while (true) {
      const { data } = await spider.getFans(ctx.authInfo, { offset, limit })
      await fansService.insertMany(data)
      offset += limit
      if (data.length < limit) break
    }
    ctx.body = offset
  }
  async rich (ctx) {
    const cookie = ctx.authInfo.cookie
    const fans = await fansService.getBeRichFans(
      { size: 1200 },
      Date.now()
    )
    for (let i = 0; i < fans.length; i++) {
      const { _id, url_token } = fans[i]
      try {
        const fansRichData = await spider.getFansData(cookie, url_token)
        const rs = await fansService.update(
          { _id },
          Object.assign(fansRichData, {
            lastRichTime: Date.now()
          })
        )
        console.log(i, url_token, fansRichData, rs)
      } catch (error) {
        console.log('error', url_token, i)
        console.log(error)
      }
    }
    ctx.body = fans.length
  }
}
module.exports = new Fans()
