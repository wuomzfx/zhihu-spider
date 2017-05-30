const spiderService = require('../service/spider')
const questionService = require('../service/question')
const topicService = require('../service/topic')
const authService = require('../service/auth')
const App = require('./app')

class Topic extends App {
  async get (ctx) {
    const data = {
      topics: await spiderService.getTopics(ctx.authInfo),
      follows: ctx.authInfo.topics
    }
    super.result(ctx, data)
  }
  async hot (ctx) {
    const { topicId } = ctx.params
    const { offset } = ctx.request.body
    super.result(ctx, await questionService.topicHot(ctx.authInfo, topicId, offset))
  }
  async follow (ctx) {
    const follows = ctx.authInfo.topics
    follows.push(ctx.request.body.topicId)
    // const follows = []
    const r1 = await topicService.upsert(ctx.request.body)
    if (!r1) super.error(ctx, 'update fail')
    const r2 = await authService.updateTopic(ctx.authInfo._id, follows)
    if (!r2) super.error(ctx, 'update fail')
    super.result(ctx, r2.topics)
  }
  async cancelFollow (ctx) {
    const follows = ctx.authInfo.topics
    const index = follows.findIndex((f, idx) => f === ctx.params.topicId)
    follows.splice(index, 1)
    const r1 = await topicService.upsert(ctx.request.body)
    if (!r1) super.error(ctx, 'update fail')
    const r2 = await authService.reduceFollows(ctx.authInfo._id, follows)
    if (!r2) super.error(ctx, 'update fail')
    super.result(ctx, r2.topics)
  }
}
module.exports = new Topic()
