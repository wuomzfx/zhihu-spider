const TopicModel = require('../model/topic')
const spiderService = require('../service/spider')
module.exports = {
  async upsert (data) {
    const cond = {
      topicId: data.topicId
    }
    data.$inc = {
      followers: 1
    }
    return TopicModel.findOneAndUpdate(cond, data, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
  },
  async reduceFollows (topicId) {
    const cond = {
      topicId: topicId
    }
    const data = {
      $inc: {
        followers: -1
      }
    }
    return TopicModel.findOneAndUpdate(cond, data, {
      new: true
    })
  },
  async getActiveTopics () {
    const cond = {
      followers: {
        $gt: 0
      }
    }
    return TopicModel.find(cond)
  },
  buildTopic (questions) {
    const q = questions[0]
    let totalVoters = 0
    questions.forEach(r => {
      totalVoters += Number(r.voters)
    })
    return {
      _id: q._id,
      qid: q.qid,
      status: q.status,
      title: q.title,
      times: questions.length,
      totalVoters: totalVoters
    }
  },
  buildTopics (questions) {
    const map = {}
    const data = []
    questions.forEach(q => {
      if (!map[q.qid]) map[q.qid] = []
      map[q.qid].push(q)
    })
    for (const q in map) {
      data.push(map[q])
    }
    const hot = data.sort((a, b) => b.length - a.length)
    return hot.map(h => this.buildTopic(h))
  },
  async getHotData (topicId, limit) {
    let data = []
    let next = Date.now()
    for (let i = 0; i < limit; i++) {
      const rs = await spiderService.getTopicHot(null, topicId, next)
      const questions = rs.questions
      data = data.concat(questions)
      next = questions[questions.length - 1].timestamp
    }
    return this.buildTopics(data)
  }
}
