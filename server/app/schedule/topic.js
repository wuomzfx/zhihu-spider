const questionService = require('../service/question')
const topicService = require('../service/topic')
const emailService = require('../service/email')
const AuthModel = require('../model/auth')

module.exports = {
  async get () {
    const topics = await topicService.getActiveTopics()
    for (let i = 0; i < topics.length; i++) {
      await this.getHotToic(topics[i])
    }
    console.log('spider topic end')
  },
  async getHotToic (topic) {
    const data = await topicService.getHotData(topic.topicId, 3)
    data.forEach(d => {
      if (d.times > 5) {
        questionService.upsertHotQuestion(d, topic.topicId)
      }
    })
  },
  async pushHotQuestions () {
    const cond = {
      status: 1
    }
    const auths = await AuthModel
                        .find(cond)
                        .sort({createTime: -1})
                        .exec()
    auths.forEach(async auth => {
      const questions = await questionService.getUnpushHotQuestion(auth.topics)
      this.pushToUser(auth, questions)
    })
  },
  async pushToUser (auth, questions) {
    if (questions.length && auth.email) {
      emailService.sendHotQuestions(auth.email, questions)
      questionService.pushedHotQuestion(auth.topics)
    }
  }
}
