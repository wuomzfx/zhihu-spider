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
      <mu-raised-button label="cancel"
                        @click.native="stopCrawling(question, $event)"
                        v-if="question.status === 1"/>
      <mu-raised-button label="active"
                        @click.native="reCrawling(question, $event)"
                        v-else/>
      <!-- <mu-switch :value="q.status === 1" @click.native="stopCrawling(q)"/> -->
    </div>
  </mu-list-item>
</template>

<script>
export default {
  props: ['question'],
  methods: {
    showData (question) {
      this.$router.push(`/data/${question.qid}`)
    },
    stopCrawling (q, e) {
      e.stopPropagation()
      window.console.log(q)
      q.status = 0
      // this.$api.stopCrawling(q.qid).then(rs => {
      //   this.questions.find()
      // }).catch(err => {
      //   window.console.log(err)
      //   window.alert('出错了，看日志去')
      // })
    },
    reCrawling (q, e) {
      e.stopPropagation()
      window.console.log(q)
      q.status = 1
      // this.$api.reCrawling(q.qid).then(rs => {
      //   this.questions.find()
      // }).catch(err => {
      //   window.console.log(err)
      //   window.alert('出错了，看日志去')
      // })
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
.question .mu-item-content span {
  line-height: 16px;
  display: inline-block;
  color: #666;
  margin: 10px 15px 0 0;
}
.question .mu-item-content span > * {
  vertical-align: top;
  margin-right: 2px;
}
.question .control .mu-raised-button {
  width: 74px;
  min-width: 74px;
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
