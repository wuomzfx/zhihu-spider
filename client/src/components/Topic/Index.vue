<template>
<div id="topic">
  <mu-appbar :title="topicTitle"></mu-appbar>
  <router-view></router-view>
</div>
</template>

<script>
export default {
  computed: {
    topicTitle () {
      return this.$route.params.name || '话题'
    }
  }
}
</script>

<style>
</style>
