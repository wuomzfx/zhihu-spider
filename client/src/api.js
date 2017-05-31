import axios from 'axios'
import {handleError} from './util'
import config from '../config'

const isProduction = process.env.NODE_ENV === 'production'
const domain = isProduction ? config.build.serverRoot : config.dev.serverRoot

const instance = axios.create({
  baseURL: `${domain}/api`
})

instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  handleError(error)
  return Promise.resolve({ error })
})

const setAuthorization = () => {
  try {
    if (window.localStorage.anserAuth) {
      const userId = JSON.parse(window.localStorage.anserAuth)._id
      instance.defaults.headers.common['Authorization'] = userId
    }
  } catch (err) {
    delete window.localStorage.anserAuth
    window.location.reload()
  }
}
setAuthorization()

const url = {
  profile: '/profile',
  explore: '/question/explore',
  topic: '/topic',
  auth: '/auth',
  question: '/question',
  qData: '/data/question'
}
export default {
  profile () {
    return instance.get(`${url.profile}/get`)
  },
  setAnserAuth (auth) {
    window.localStorage.setItem('anserAuth', JSON.stringify(auth))
    setAuthorization()
  },
  questionList (query) {
    return instance.get(url.question, {params: query})
  },
  addQuestion (question) {
    return instance.post(url.question, question)
  },
  questionData (qid) {
    return instance.get(`${url.qData}/${qid}`)
  },
  stopCrawling (qid) {
    return instance.get(`${url.question}/stop/${qid}`)
  },
  reCrawling (qid) {
    return instance.get(`${url.question}/recrawling/${qid}`)
  },
  explore (offset) {
    return instance.get(`${url.explore}/${offset}`)
  },
  getCaptcha () {
    const t = Math.ceil(Math.random() * 100000)
    return `${domain}/api${url.auth}/captcha.gif?t=${t}`
  },
  deleteAllCoookie () {
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    })
  },
  initLogin () {
    // this.deleteAllCoookie()
    return instance.get(`${url.auth}/init-login`, {
      withCredentials: true
    })
  },
  login (params) {
    return instance.post(`${url.auth}/login`, params, {
      withCredentials: true
    })
  },
  quickSearch (token) {
    return instance.get(`${url.question}/quick-search`, {
      params: {
        token: token
      }
    })
  },
  search (query) {
    return instance.get(`${url.question}/search`, {
      params: query
    })
  },
  getTopics () {
    return instance.get(`${url.topic}/get`)
  },
  getTopicHot (topicId, offset) {
    return instance.post(`${url.topic}/hot/${topicId}`, {
      offset: offset
    })
  },
  followTopic (topic) {
    return instance.post(`${url.topic}/follow`, topic)
  },
  unfollowTopic (topicId) {
    return instance.get(`${url.topic}/unfollow/${topicId}`)
  },
  update () {
    return instance.get(`${url.auth}/update`)
  },
  getUser () {
    return instance.get(`${url.auth}/get`)
  }
}
