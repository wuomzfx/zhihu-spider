<template>
<div class="topic-content">
  <loading-box v-if="loading"></loading-box>
  <div class="question-list app-content" v-else>
    <div class="header">
      <span>当前热门问答</span>
      <mu-switch label="推送" class="push-switch" @change="followChange" :value="followed"/>
    </div>
    <mu-list>
      <topic-question v-for="topic in topics"
                      key="topic.qid"
                      class="topic"
                      :question="topic"></topic-question>
    </mu-list>
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
      limit: 2,
      userTopics: []
    }
  },
  computed: {
    topicId () {
      return Number(this.$route.params.topicId)
    },
    followed () {
      return this.userTopics.find(t => t === this.topicId) && true
    }
  },
  methods: {
    followChange (value) {
      if (value) {
        this.follow()
      } else {
        this.unfollow()
      }
    },
    unfollow () {
      this.$api.unfollowTopic(this.topicId)
    },
    follow () {
      const topic = this.$route.params
      this.$api.followTopic(topic).then(rs => {
        window.console.log(rs)
      })
    },
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
      const offset = Math.ceil(Date.now() / 1000)
      this.getTopicHot(this.topicId, offset).then(rs => {
        this.loading = false
        this.topics = this.buildTopics(rs)
        window.console.log(this.topics)
      })
    },
    getUser () {
      return this.$api.getUser().then(rs => {
        window.console.log(rs)
        this.userTopics = rs.data.user.topics
        return rs
      })
    }
  },
  mounted () {
    this.getUser().then(() => {
      // this.loading = false
      this.getHot()
    })
  }
}
</script>

<style>
.topic-content .header{
  border-bottom: 1px solid #f5f5f5;
  padding: 20px 16px;
  font-size: 14px;
  color: #777;
}
.topic-content .push-switch {
  float: right;
}
</style>
