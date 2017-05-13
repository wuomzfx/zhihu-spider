const Router = require('koa-router')
const router = new Router()
const data = require('./controller/data')
const question = require('./controller/question')
const auth = require('./controller/auth')
const profile = require('./controller/profile')

// router.get('/', action.index)
// router.get('/spider', action.spider)

router.get('/api/profile/get', profile.getInfo)

router.get('/api/auth/init-login', auth.initLogin)
router.get('/api/auth/captcha.gif', auth.captcha)
router.get('/api/auth/update', auth.updateInfo)
router.post('/api/auth/login', auth.login)

router.post('/api/question', question.create)
router.get('/api/question', question.get)
router.get('/api/question/stop/:qid', question.stop)
router.get('/api/question/recrawling/:qid', question.reActive)
router.get('/api/question/explore/:offset', question.explore)
router.get('/api/question/quick-search', question.quickSearch)
router.get('/api/question/search', question.search)

router.get('/api/data/question/:qid', data.question)

module.exports = router
