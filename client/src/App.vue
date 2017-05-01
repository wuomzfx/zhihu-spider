<template>
  <div id="app">
    <!-- <app-header></app-header> -->
    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppHeader from './components/Header'
import AppFooter from './components/Footer'
export default {
  components: {
    AppHeader,
    AppFooter
  }
}
</script>
<style>
.app-content {
  position: absolute;
  width: 100%;
  top: 56px;
  bottom: 56px;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}
</style>
