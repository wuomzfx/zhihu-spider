<template>
  <mu-list-item :disableRipple="true"
                class="question"
                @click.native="showData(question)">
    <div class="mu-item-title" slot="title">
      <a :href="quetsionUrl" @click.stop="() => {}">{{question.title}}</a>
    </div>
    <div class="overview">
      <span class="star"><mu-icon :size="16" value="star"/><i>{{question.data.followers}}</i></span>
      <span class="answer"><mu-icon :size="16" value="question_answer"/><i>{{question.data.answers}}</i></span>
      <span class="reader"><mu-icon :size="16" value="remove_red_eye"/><i>{{question.data.readers}}</i></span>
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
import mixin from './QuestionMixin'
export default {
  mixins: [mixin],
  data () {
    return {
      quetsionUrl: `https://www.zhihu.com/question/${this.question.qid}`
    }
  },
  methods: {
    showData (question) {
      if (question._id) this.$router.push(`/data/${question.qid}`)
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
.question .mu-item-title a{
  color: rgba(0, 0, 0, 0.87);
}
.question .overview > span {
  line-height: 16px;
  display: inline-block;
  color: #666;
  margin: 10px 15px 0 0;
}
.question .overview > span > i {
  vertical-align: top;
  margin-right: 2px;
  font-style: normal;
}
.question .overview .mu-icon {
  margin-top: -1px;
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
