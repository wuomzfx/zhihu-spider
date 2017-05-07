const spider = require('../service/spider')
const authService = require('../service/auth')
const App = require('./app')

class Auth extends App {
  async check (ctx, next) {
    if (ctx.request.url.indexOf('auth') >= 0) {
      return next()
    }
    const rs = await authService.check(ctx.header.authorization)
    if (rs.success) {
      ctx.authInfo = rs.auth
      return next()
    } else {
      super.result(ctx, rs)
    }
  }
  async login (ctx) {
    const params = ctx.request.body
    let rs = await authService.login(params, ctx.header.cookie)
    if (rs.success) {
      rs.auth = await authService.upsertAuth(params.phone_num, rs.headers, ctx.header.cookie)
    }
    super.result(ctx, rs)
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
      super.handleHeaders(ctx, {
        headers: res.headers
      })
      ctx.body = body
    })
  }
}
module.exports = new Auth()
