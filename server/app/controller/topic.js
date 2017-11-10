const spiderService = require('../service/spider')
const questionService = require('../service/question')
const topicService = require('../service/topic')
const authService = require('../service/auth')
const App = require('./app')

class Topic extends App {
  async get (ctx) {
    const data = {
      topics: (await spiderService.getTopicsByApi(ctx.authInfo)).topics,
      follows: ctx.authInfo.topics
    }
    super.result(data)
  }
  async hot (ctx) {
    const { topicId } = ctx.params
    const { offset } = ctx.request.body
    super.result(await questionService.topicHot(ctx.authInfo, topicId, offset))
  }
  async follow (ctx) {
    const follows = ctx.authInfo.topics
    follows.push(Number(ctx.request.body.topicId))
    // const follows = []
    const r1 = await topicService.upsert(ctx.request.body)
    if (!r1) {
      super.error('update fail')
      return
    }
    const r2 = await authService.updateTopic(ctx.authInfo._id, follows)
    if (!r2) {
      super.error('update fail')
      return
    }
    super.result(r2.topics)
  }
  async cancelFollow (ctx) {
    const follows = ctx.authInfo.topics
    const topicId = Number(ctx.params.topicId)
    const index = follows.findIndex(f => f === topicId)
    if (index < 0) {
      super.error('本来就没关注啦')
      return
    }
    follows.splice(index, 1)
    const r1 = await topicService.upsert(ctx.request.body)
    if (!r1) {
      super.error('update fail')
      return
    }
    const r2 = await authService.updateTopic(ctx.authInfo._id, follows)
    if (!r2) {
      super.error('update fail')
      return
    }
    super.result(r2.topics)
  }
}
module.exports = new Topic()
