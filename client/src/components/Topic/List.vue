<template>
<div class="topic-list">
  <loading-box v-if="loading"></loading-box>
  <mu-raised-button v-for="topic in topics"
                    :key="topic.topicId"
                    :backgroundColor="bgColor(topic)"
                    :label="topic.name"
                    :to="{
                      name: 'TopicContent',
                      params: topic
                    }"
                    class="topic"/>
</div>
</template>

<script>
import LoadingBox from '../Loading'
export default {
  components: {
    LoadingBox
  },
  data () {
    return {
      loading: true,
      follows: [],
      topics: []
    }
  },
  computed: {
    mapFollows () {
      const data = {}
      this.follows.forEach(f => {
        data[f] = true
      })
      return data
    }
  },
  methods: {
    bgColor (topic) {
      return this.mapFollows[topic.topicId] ? '#2196f3' : ''
    },
    getTopics () {
      this.$api.getTopics().then(rs => {
        this.loading = false
        this.follows = rs.data.follows
        this.topics = rs.data.topics.topics
      })
    }
  },
  mounted () {
    this.getTopics()
  }
}
</script>

<style>
.topic-list {
  padding: 10px;
}
.mu-raised-button.topic {
  min-width: 0;
  padding: 10px 15px;
  /*vertical-align: top;
  text-align: center;
  border-radius: 5px;
  padding: 10px 15px;*/
  margin: 10px;
}
.topic .mu-raised-button-label {
  padding: 0;
}
</style>
