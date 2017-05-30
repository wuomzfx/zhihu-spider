const spiderService = require('../service/spider')
const questionService = require('../service/question')
const App = require('./app')

class Topic extends App {
  async get (ctx) {
    super.result(ctx, await spiderService.getTopics(ctx.authInfo))
  }
  async hot (ctx) {
    const { topicId } = ctx.params
    const { offset } = ctx.request.body
    super.result(ctx, await questionService.topicHot(ctx.authInfo, topicId, offset))
  }
}
module.exports = new Topic()
