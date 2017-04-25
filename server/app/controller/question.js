const service = require('../service/question')
const App = require('./app')
class Question extends App {
  constructor () {
    super()
    this.create = this.create.bind(this)
  }
  async create (ctx) {
    const { qid, title } = ctx.request.body
    if (!qid && !title) {
      console.log(this.show)
      ctx.body = '别瞎填'
      return
    }
    ctx.body = await service.add(qid)
  }
}
module.exports = new Question()
