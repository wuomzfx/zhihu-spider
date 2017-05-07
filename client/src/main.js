// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import api from './api'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-light.css' // light, dark, carbon, teal
Vue.use(MuseUI)

Vue.prototype.$http = axios
Vue.prototype.$api = api
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' || window.localStorage.anserAuth) {
    next()
  } else {
    next('/login')
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
