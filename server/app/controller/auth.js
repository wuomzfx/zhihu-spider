const spider = require('../service/spider')
const authService = require('../service/auth')
const App = require('./app')

class Auth extends App {
  async check (ctx, next) {
    const url = ctx.request.url
    if (url.indexOf('auth') >= 0 && url !== '/api/auth/update') {
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
    if (rs.success && !rs.auth) {
      rs.auth = await authService.upsertAuth(params, rs.headers)
    }
    super.result(ctx, rs)
  }
  async initLogin (ctx) {
    super.deleteCookie(ctx)
    ctx.body = {
      success: true
    }
    // 发现并不需要xsrf token
    // super.result(ctx, await spider.initLogin())
  }
  async updateInfo (ctx) {
    const rs = await authService.updateUserInfo(ctx.authInfo)
    super.result(ctx, rs)
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
