<template>
  <div id="app">
    <!-- <app-header></app-header> -->
    <div class="app-content">
      <router-view></router-view>
    </div>
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
