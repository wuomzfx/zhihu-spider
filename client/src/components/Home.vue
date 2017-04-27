<template>
  <div>
    <!-- <input type="text" v-model="question.qid" placeholder="请输入问题Id">
    <button @click="addQuestion">添加</button> -->
    <div class="question-list">
      <mu-list>
        <mu-list-item v-for="q in questions" key="q._id" :title="q.title" class="question">
          <div class="overview">
            <span class="star"><mu-icon :size="16" value="star"/>123</span>
            <span class="answer"><mu-icon :size="16" value="question_answer"/>123</span>
            <span class="reader"><mu-icon :size="16" value="remove_red_eye"/>123</span>
          </div>
          <div class="control" slot="right">
            <mu-switch :value="q.status === 1" />
          </div>
        </mu-list-item>
      </mu-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      questions: [],
      query: {
        page: 1,
        size: 10
      },
      question: {
        qid: null
      }
    }
  },
  methods: {
    addQuestion () {
      this.$http.post(this.api.question, this.question).then(rs => {
        console.log(rs.data)
      })
    },
    getQuestion () {
      this.$http.get(this.api.question, this.query).then(rs => {
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
