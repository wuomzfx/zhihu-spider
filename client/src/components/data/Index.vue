<template>
  <div class="data-page">
    <mu-appbar :title="question.title"></mu-appbar>
    <div class="app-content" v-if="qData.length">
      <chart-box :data="qData"></chart-box>
      <detail :data="qData"></detail>
    </div>
  </div>
</template>

<script>
import ChartBox from './ChartBox'
import Detail from './Detail'
export default {
  props: ['title'],
  components: {
    ChartBox,
    Detail
  },
  data () {
    return {
      question: {},
      qData: [],
      color: {
        readers: '75,192,192', // 绿色
        answers: '30,150,243', // 蓝色
        followers: '255,167,38' // 橙色
      }
    }
  },
  methods: {
    getData () {
      this.$api.questionData(this.$route.params.qid).then(rs => {
        this.question = rs.data.question
        this.qData = rs.data.data
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style>
</style>
