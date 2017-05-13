<template>
  <div class="home-page">
    <mu-appbar title="问题列表">
      <mu-flat-button :label="modeLabel" slot="right" @click="changeMode()"/>
    </mu-appbar>
    <div class="question-list app-content">
      <mu-list>
        <question v-for="q in questions" :key="q._id" :question='q'>
        </question>
      </mu-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loadToken" @load="loadMore" loadingText="loading" :class="{noMore: noMore}">
      </mu-infinite-scroll>
    </div>
    <add-que v-on:add="addQuestion"></add-que>
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
      scroller: null,
      questions: [],
      loading: true,
      loadToken: false,
      noMore: false,
      query: {
        status: 1,
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    modeLabel () {
      return this.query.status === 1 ? '历史跟踪' : '当前跟踪'
    }
  },
  watch: {
    query: {
      deep: true,
      handler () {
        this.getQuestion()
      }
    }
  },
  methods: {
    getProfile () {
      this.$api.profile()
    },
    update () {
      this.$api.update().then(rs => {
        window.console.log(rs)
      })
    },
    loadMore () {
      window.console.log('123')
      if (this.noMore) return
      this.query.page += 1
    },
    addQuestion (question) {
      window.console.log(question)
      this.questions.splice(0, 0, question)
    },
    getQuestion () {
      if (this.loadToken) return
      this.loadToken = true
      this.$api.questionList(this.query).then(rs => {
        this.loadToken = false
        this.questions = this.questions.concat(rs.data.data)
        if (rs.data.data.length < this.query.size) {
          this.noMore = true
        } else {
          this.noMore = false
        }
      }).catch(() => {
        this.loadToken = false
      })
    },
    changeMode () {
      this.questions = []
      this.noMore = false
      this.query = {
        status: this.query.status === 1 ? 0 : 1,
        size: this.query.size,
        page: 1
      }
    }
  },
  mounted () {
    this.scroller = document.querySelector('.app-content')
    this.getQuestion()
  }
}
</script>

<style>
.question-list {
  /*padding-bottom: 80px;*/
}
.home-page .mu-infinite-scroll {
  padding: 24px 0;
}
.home-page .mu-infinite-scroll.noMore:after {
  content: "无更多数据"
}
</style>
