const stream = require('stream')
const spider = require('../service/spider')
const auth = require('../service/auth')
const App = require('./app')

class Question extends App {
  async login (ctx) {
    const params = ctx.request.body
    // super.result(ctx, await auth.login())
    ctx.body = await auth.login(params, ctx.header.cookie)
  }
  async initLogin (ctx) {
    super.result(ctx, await spider.initLogin())
  }
  async captcha (ctx) {
    await spider.getCaptcha((err, res, body) => {
      if (err) {
        ctx.body = {
          status: 500
        }
      }
      for (var h in res.headers) {
        if (h === 'set-cookie') {
          const cookies = res.headers[h].map(r => {
            return r.split(';')[0] + ';'
          })
          ctx.set('set-cookie', cookies)
        } else {
          ctx.set(h, res.headers[h])
        }
      }
      ctx.body = body
    })
  }
}
module.exports = new Question()
