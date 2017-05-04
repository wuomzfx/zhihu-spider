// const spider = require('../service/spider')
const auth = require('../service/auth')
const App = require('./app')

class Question extends App {
  async login (ctx) {
    const params = ctx.request.body
    console.log(params)
    // super.result(ctx, await auth.login())
    ctx.body = await auth.login(params)
  }
  async initLogin (ctx) {
    const { cookie } = ctx.request.body
    // super.result(ctx, await spider.initLogin())
    ctx.body = {
      data: cookie
    }
  }
}
module.exports = new Question()
