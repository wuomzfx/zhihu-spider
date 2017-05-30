<template>
<div class="topic-content">
  <div class="question-list app-content">
    <mu-list>
      <topic-question v-for="topic in topics"
                      key="topic.qid"
                      class="topic"
                      :question="topic"></topic-question>
    </mu-list>
    <loading-box v-if="loading"></loading-box>
  </div>
</div>
</template>

<script>
import TopicQuestion from './TopicQuestion'
import LoadingBox from '../Loading'
export default {
  components: {
    TopicQuestion,
    LoadingBox
  },
  data () {
    return {
      loading: true,
      questions: [],
      topics: [],
      getTimes: 0,
      limit: 2
    }
  },
  methods: {
    getTopicHot (topicId, offset) {
      return new Promise((resolve, reject) => {
        this.$api.getTopicHot(topicId, offset).then(rs => {
          const questions = rs.data.questions
          const next = questions[questions.length - 1].timestamp
          this.questions = this.questions.concat(questions)
          this.getTimes ++
          if (this.limit <= this.getTimes) {
            resolve(this.questions)
          } else {
            resolve(this.getTopicHot(topicId, next))
          }
        })
      })
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
    getHot () {
      const topicId = this.$route.params.id
      const offset = Math.ceil(Date.now() / 1000)
      this.getTopicHot(topicId, offset).then(rs => {
        this.loading = false
        this.topics = this.buildTopics(rs)
        window.console.log(this.topics)
      })
    }
  },
  mounted () {
    this.getHot()
  }
}
</script>

<style>
</style>
