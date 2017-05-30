<template>
<div class="topic-list">
  <loading-box v-if="loading"></loading-box>
  <mu-raised-button v-for="topic in topics"
                    :key="topic.id"
                    :label="topic.name"
                    :to="{
                      name: 'TopicContent',
                      params: {
                        id: topic.id,
                        name: topic.name
                      }
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
      topics: []
    }
  },
  methods: {
    getTopics () {
      this.$api.getTopics().then(rs => {
        this.loading = false
        window.console.log(rs)
        this.topics = rs.data.topics
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
