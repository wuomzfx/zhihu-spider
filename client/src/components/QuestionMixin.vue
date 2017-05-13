<script>
export default {
  props: ['question'],
  methods: {
    stopCrawling (q, e) {
      e.stopPropagation()
      this.$api.stopCrawling(q.qid).then(rs => {
        q.status = 0
      })
    },
    addQuestion (q, e) {
      e.stopPropagation()
      this.$api.addQuestion(q).then(rs => {
        q.status = 1
      })
    },
    reCrawling (q, e) {
      if (!q._id) return this.addQuestion(q, e)
      e.stopPropagation()
      this.$api.reCrawling(q.qid).then(rs => {
        q.status = 1
      })
    }
  }
}
</script>
