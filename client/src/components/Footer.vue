<template>
  <mu-paper id="footer">
      <mu-bottom-nav :value="$route.name">
        <mu-bottom-nav-item value="Home" title="Home" to="/" icon="home"/>
        <mu-bottom-nav-item value="Explore" title="Explore" to="/explore" icon="explore"/>
      </mu-bottom-nav>
  </mu-paper>
</template>

<script>
export default {
}
</script>

<style>
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
