import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Explore from '@/components/Explore'
import Search from '@/components/Search'
import Data from '@/components/data/Index'
import Login from '@/components/Login'
import Topic from '@/components/Topic/Index'
import TopicList from '@/components/Topic/List'
import TopicContent from '@/components/Topic/Content'

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
      path: '/topic',
      name: 'Topic',
      component: Topic,
      children: [{
        path: 'list',
        name: 'TopicList',
        component: TopicList
      }, {
        path: 'content/:name/:topicId/:urlToken',
        name: 'TopicContent',
        component: TopicContent
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/data/:qid',
      name: 'Data',
      component: Data
    }
  ]
})
