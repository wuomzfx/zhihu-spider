import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Explore from '@/components/Explore'
import Data from '@/components/Data'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/explore',
      name: 'Explore',
      component: Explore
    },
    {
      path: '/data/:qid',
      name: 'Data',
      component: Data
    }
  ]
})
