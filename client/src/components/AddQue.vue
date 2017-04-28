<template>
  <div>
    <mu-paper class="add-act" circle :zDepth="1">
      <mu-icon-button @click="open">
        <mu-icon :size="30" value="add"/>
      </mu-icon-button>
    </mu-paper>
    <mu-dialog :open="dialog" title="添加问题" @close="close">
      <mu-text-field v-model="question.url" hintText="URL"/>
      <mu-text-field v-model="question.qid" hintText="ID"/>
      <mu-flat-button slot="actions" primary @click="addQuestion" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      question: {
        qid: null,
        url: null
      },
      dialog: false
    }
  },
  methods: {
    addQuestion () {
      this.$api.addQuestion(this.api.question, this.question).then(rs => {
        if (rs.data.success) {

        } else {
          window.alert(rs.data.msg)
        }
        console.log(rs.data)
      })
      this.close()
    },
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style>
.mu-paper.add-act {
  background-color: #ffb300;
  display: inline-block;
  height: 48px;
  width: 48px;
  text-align: center;
  position: fixed;
  right: 20px;
  bottom: 80px;
}
.mu-paper.add-act i {
  color: #fff;
  line-height: 48px;
  height: 48px !important;
  display: inline-block;
}
.mu-paper .mu-icon-button {
  padding: 0;
}
</style>
