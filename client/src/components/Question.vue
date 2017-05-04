<template>
  <mu-list-item :title="question.title"
                :disableRipple="true"
                class="question"
                @click.native="showData(question)">
    <div class="overview">
      <span class="star"><mu-icon :size="16" value="star"/>{{question.data.followers}}</span>
      <span class="answer"><mu-icon :size="16" value="question_answer"/>{{question.data.answers}}</span>
      <span class="reader"><mu-icon :size="16" value="remove_red_eye"/>{{question.data.readers}}</span>
    </div>
    <div class="control" slot="right">
      <mu-raised-button label="取消"
                        @click.native="stopCrawling(question, $event)"
                        v-if="question.status === 1"/>
      <mu-raised-button label="跟踪"
                        backgroundColor="#2196f3"
                        @click.native="reCrawling(question, $event)"
                        v-else/>
    </div>
  </mu-list-item>
</template>

<script>
export default {
  props: ['question'],
  methods: {
    showData (question) {
      if (question._id) this.$router.push(`/data/${question.qid}`)
    },
    stopCrawling (q, e) {
      e.stopPropagation()
      this.$api.stopCrawling(q.qid).then(rs => {
        q.status = 0
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    },
    addQuestion (q, e) {
      e.stopPropagation()
      this.$api.addQuestion(q).then(rs => {
        q.status = 1
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    },
    reCrawling (q, e) {
      if (!q._id) return this.addQuestion(q, e)
      e.stopPropagation()
      this.$api.reCrawling(q.qid).then(rs => {
        q.status = 1
      }).catch(err => {
        window.console.log(err)
        if (err.response) {
          window.alert(err.response.data.msg)
        }
      })
    }
  }
}
</script>

<style>
.question .mu-item-right {
  width: 85px;
}
.question .mu-item.show-right {
  padding-right: 120px;
  border-bottom: 1px solid #f5f5f5;
}
.question .mu-item-title {
  line-height: 1.4;
}
.question .overview > span {
  line-height: 16px;
  display: inline-block;
  color: #666;
  margin: 10px 15px 0 0;
}
.question .overview > span > * {
  vertical-align: top;
  margin-right: 2px;
}
.question .control .mu-raised-button {
  width: 60px;
  min-width: 60px;
}
.question .mu-raised-button-label {
  padding: 0;
}
.question .star .mu-icon {
  color: #ffc107;
}
.question .answer .mu-icon {
  color: #2196f3;
}
</style>
