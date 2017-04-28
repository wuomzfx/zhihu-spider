<template>
  <div>
    <mu-appbar title="问题列表"></mu-appbar>
    <div class="question-list">
      <mu-list>
        <mu-list-item v-for="q in questions" key="q._id" :title="q.title" class="question" @click.native="showData(q)">
          <div class="overview">
            <span class="star"><mu-icon :size="16" value="star"/>{{q.data.followers}}</span>
            <span class="answer"><mu-icon :size="16" value="question_answer"/>{{q.data.answers}}</span>
            <span class="reader"><mu-icon :size="16" value="remove_red_eye"/>{{q.data.readers}}</span>
          </div>
          <div class="control" slot="right">
            <mu-switch :value="q.status === 1" />
          </div>
        </mu-list-item>
      </mu-list>
    </div>
    <add-que></add-que>
  </div>
</template>

<script>
import AddQue from './AddQue'
export default {
  components: {
    AddQue
  },
  data () {
    return {
      questions: [],
      dataMap: {},
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
    },
    showData (question) {
      this.$router.push(`/data/${question.qid}`)
    }
  },
  mounted () {
    console.log('123')
    this.getQuestion()
  }
}
</script>

<style>
.question .mu-item-right {
  /*width: 85px;*/
}
.question .mu-item.show-right {
  padding-right: 100px;
  border-bottom: 1px solid #f5f5f5;
}
.question .mu-item-title {
  line-height: 1.4;
}
.question .mu-item span {
  line-height: 16px;
  display: inline-block;
  color: #666;
  margin: 10px 15px 0 0;
}
.question .mu-item span > * {
  vertical-align: top;
  margin-right: 2px;
}
.question .star .mu-icon {
  color: #ffc107;
}
.question .answer .mu-icon {
  color: #2196f3;
}
</style>
