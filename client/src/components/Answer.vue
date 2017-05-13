<template>
  <mu-list-item :disableRipple="true"
                class="question has-answer">
    <div class="mu-item-title" slot="title">
      <a :href="answerUrl">{{question.title}}</a>
    </div>
    <div class="answer-summary" v-html="question.answer"></div>
    <div class="overview">
      <span class="vote"><mu-icon :size="16" value="thumb_up"/><i>{{question.voters}}</i></span>
      <span class="comment"><mu-icon :size="16" value="comment"/><i>{{question.comments}}</i></span>
      <div class="control">
        <mu-raised-button label="取消"
                          @click.native="stopCrawling(question, $event)"
                          v-if="question.status === 1"/>
        <mu-raised-button label="跟踪"
                          backgroundColor="#2196f3"
                          @click.native="reCrawling(question, $event)"
                          v-else/>
      </div>
    </div>
  </mu-list-item>
</template>

<script>
import mixin from './QuestionMixin'
export default {
  mixins: [mixin],
  data () {
    return {
      answerUrl: `https://www.zhihu.com/question/${this.question.qid}/answer/${this.question.aid}`
    }
  }
}
</script>

<style>
.question.has-answer .mu-item {
  border-bottom: 1px solid #f5f5f5;
}
.question.has-answer .mu-item-title a{
  color: #259;
}
.answer-summary {
  padding: 10px 0;
  color: #666;
}
.question.has-answer  .control {
  display: inline-block;
  float: right;
}
.question.has-answer  .overview > span {
  margin-top: 13px;
}
.question .vote .mu-icon {
  color: #2196f3;
}
.question .comment .mu-icon {
  /*color: #2196f3;*/
}
</style>
