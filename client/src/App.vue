<template>
  <div id="app">
    <input type="text" v-model="question.qid" placeholder="请输入问题Id">
    <button @click="addQuestion">添加</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      question: {
        qid: null
      }
    }
  },
  methods: {
    addQuestion () {
      this.$http.post(this.api.question, this.question).then(rs => {
        console.log(rs)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
