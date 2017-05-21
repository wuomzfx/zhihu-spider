<template>
  <div id="search">
    <mu-appbar id="search-bar">
      <mu-text-field fullWidth
                     icon="search"
                     v-model="query.q"
                     @input="search"
                     class="search-field"
                     hintText="请输入搜索内容"/>
    </mu-appbar>
    <div class="question-list app-content">
      <mu-list>
        <answer v-for="q in questions" :key="q.qid" :question='q'></answer>
      </mu-list>
      <mu-infinite-scroll :scroller="scroller" :loading="loadToken" @load="searchAct" loadingText="loading">
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
      trigger: document.querySelector('#search-bar'),
      query: {
        q: '',
        correction: 0,
        type: 'content',
        offset: 0
      },
      scroller: null,
      loadToken: false,
      questions: []
    }
  },
  methods: {
    search (query) {
      window.setTimeout(() => {
        if (query === this.query.q) {
          this.query.offset = 0
          this.questions = []
          this.searchAct()
        }
      }, 700)
    },
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
    searchAct () {
      if (this.loadToken) return
      this.loadToken = true
      this.$api.search(this.query).then(rs => {
        if (rs.data.success) {
          this.loadToken = false
          const questions = rs.data.questions
          this.questions = this.questions.concat(questions)
          this.query.offset += 10
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
  }
}
</script>

<style>
#search .mu-text-field-hint {
  color: #8cc0ec;
}
#search .mu-text-field-input{
  color: #eee;
}
#search .mu-text-field-icon {
  top: 4px;
  left: 0px;
}
#search .mu-text-field.has-icon {
  color: #eee;
  margin: 0;
  vertical-align: top;
  margin-top: 12px;
  min-height: 32px;
  padding-left: 30px;
}
#search .mu-text-field-content hr {
  display: none;
}
#search .mu-text-field-content {
  padding: 0;
  color: #eee;
}
.quick-search {
  width: 100%;
}
</style>
