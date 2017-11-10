const Router = require('koa-router')
const router = new Router()
const data = require('./controller/data')
const question = require('./controller/question')
const auth = require('./controller/auth')
const profile = require('./controller/profile')
const topic = require('./controller/topic')
const email = require('./service/email')

// router.get('/', action.index)
// router.get('/spider', action.spider)

const routerMap = [
  ['get', '/api/profile/get', profile, 'getInfo'],

  ['get', '/api/auth/init-login', auth, 'initLogin'],
  ['get', '/api/auth/captcha.gif', auth, 'captcha'],
  ['get', '/api/auth/update', auth, 'updateInfo'],
  ['post', '/api/auth/login', auth, 'login'],
  ['get', '/api/auth/get', auth, 'get'],

  ['post', '/api/question', question, 'create'],
  ['get', '/api/question', question, 'get'],
  ['get', '/api/question/stop/:qid', question, 'stop'],
  ['get', '/api/question/recrawling/:qid', question, 'reActive'],
  ['get', '/api/question/explore/:offset', question, 'explore'],
  ['get', '/api/question/quick-search', question, 'quickSearch'],
  ['get', '/api/question/search', question, 'search'],

  ['get', '/api/data/question/:qid', data, 'question'],

  ['get', '/api/topic/get', topic, 'get'],
  ['post', '/api/topic/hot/:topicId', topic, 'hot'],
  ['post', '/api/topic/follow', topic, 'follow'],
  ['get', '/api/topic/unfollow/:topicId', topic, 'cancelFollow'],

  ['get', '/api/auth/email/send', email, 'sendAct']
]

routerMap.map(route => {
  const [ method, path, controller, action ] = route

  router[method](path, async (ctx, next) =>
    controller[action].bind(Object.assign(controller, { ctx }))(ctx, next)
  )
})

module.exports = router
