const service = require('../service/question')
const App = require('./app')
const getQidByUrl = (url) => {
  try {
    const reg = /www.zhihu.com\/question\/(\d*)/
    return url.match(reg)[1]
  } catch (err) {
    return false
  }
}
class Question extends App {
  async create (ctx) {
    let { qid, url } = ctx.request.body
    if (!qid && !url) {
      super.error(ctx, '别瞎填')
      return
    }
    qid = qid | getQidByUrl(url)
    if (!qid) {
      super.error(ctx, 'url错误')
      return
    }
    // super.error(ctx, '反正就是错了')
    super.result(ctx, await service.add(ctx.authInfo, qid))
  }
  async get (ctx) {
    let {page = 1, size = 10, status = 1} = ctx.request.query
    page = Number(page)
    size = Number(size)
    const cond = {
      userId: ctx.header.authorization,
      status: Number(status)
    }
    ctx.body = {
      data: await service.get(page, size, cond),
      pageData: {
        page: page,
        size: size
      }
    }
  }
  async stop (ctx) {
    const { qid } = ctx.params
    ctx.body = await service.stop(qid)
  }
  async reActive (ctx) {
    const { qid } = ctx.params
    ctx.body = await service.reActive(qid)
  }
  async explore (ctx) {
    const { offset } = ctx.params
    super.result(ctx, await service.explore(ctx.authInfo.cookie, offset))
  }
}
module.exports = new Question()
