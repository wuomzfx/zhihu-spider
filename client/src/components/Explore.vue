<template>
  <div id="explore">
    <mu-appbar title="发现"></mu-appbar>
    <div class="question-list app-content">
      <mu-list>
        <answer v-for="q in questions" :key="q.qid" :question='q'></answer>
      </mu-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loadToken" @load="explore" loadingText="loading">
      </mu-infinite-scroll>
    </div>
  </div>
</template>

<script>
import Answer from './Answer'
export default {
  components: {
    Answer
  },
  data () {
    return {
      scroller: null,
      loadToken: false,
      offset: 0,
      questions: []
    }
  },
  methods: {
    isContinue () {
      if (this.offset === 0) return
      window.setTimeout(() => {
        const listHeight = document.querySelector('.mu-list').clientHeight
        const contentHeight = document.querySelector('.app-content').clientHeight
        if (listHeight < contentHeight) {
          this.explore()
        }
      })
    },
    explore () {
      if (this.loadToken) return
      this.loadToken = true
      this.$api.explore(this.offset).then(rs => {
        if (rs.data.success) {
          this.loadToken = false
          const questions = rs.data.questions
          this.questions = this.questions.concat(questions)
          this.offset += questions.length
          this.isContinue()
        } else {
          window.alert(rs.data.msg)
        }
      }).catch(() => {
        this.loadToken = false
      })
    }
  },
  mounted () {
    this.scroller = document.querySelector('.app-content')
    this.explore()
  }
}
</script>

<style>
</style>
