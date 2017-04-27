const service = require('../service/question')
const App = require('./app')
class Question extends App {
  async create (ctx) {
    const { qid, title } = ctx.request.body
    if (!qid && !title) {
      super.error(ctx, '别瞎填')
      return
    }
    ctx.body = await service.add(qid)
  }
  async get (ctx) {
    const {page = 1, size = 10} = ctx.request.body
    ctx.body = await service.get(page, size)
  }
}
module.exports = new Question()
