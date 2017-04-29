<template>
  <div>
    <mu-appbar title="问题列表"></mu-appbar>
    <div class="question-list app-content">
      <mu-list>
        <question v-for="q in questions" key="q._id" :question='q'>
        </question>
      </mu-list>
    </div>
    <add-que></add-que>
  </div>
</template>

<script>
import AddQue from './AddQue'
import Question from './Question'
export default {
  components: {
    AddQue,
    Question
  },
  data () {
    return {
      questions: [],
      query: {
        page: 1,
        size: 10
      }
    }
  },
  methods: {
    getQuestion () {
      this.$api.questionList(this.query).then(rs => {
        this.questions = this.questions.concat(rs.data)
      })
    }
  },
  mounted () {
    this.getQuestion()
  }
}
</script>

<style>
.question-list {
  padding-bottom: 80px;
}
</style>
