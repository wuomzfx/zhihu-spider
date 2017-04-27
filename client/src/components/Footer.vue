<template>
  <mu-paper id="footer">
      <mu-bottom-nav :value="bottomNav" @change="handleChange">
        <mu-bottom-nav-item value="home" title="Home" to="/" icon="home"/>
        <mu-bottom-nav-item value="explore" title="Explore" to="/explore" icon="explore"/>
      </mu-bottom-nav>
  </mu-paper>
</template>

<script>
export default {
  data () {
    return {
      bottomNav: 'home'
    }
  },
  methods: {
    handleChange (val) {
      this.bottomNav = val
    }
  }
}
</script>

<style>
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
