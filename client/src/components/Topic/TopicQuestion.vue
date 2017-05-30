<template>
  <mu-list-item :disableRipple="true"
                class="question">
    <div class="mu-item-title" slot="title">
      <a :href="quetsionUrl">{{question.title}}</a>
    </div>
    <div class="overview">
      <span class="star"><mu-icon :size="16" value="loop"/><i>{{question.times}}</i></span>
      <span class="vote"><mu-icon :size="16" value="thumb_up"/><i>{{question.totalVoters}}</i></span>
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
import mixin from '../QuestionMixin'
export default {
  mixins: [mixin],
  mounted () {
    // window.console.log(this.question)
  },
  data () {
    return {
      quetsionUrl: `https://www.zhihu.com/question/${this.question.qid}`
    }
  }
}
</script>

<style>
</style>
