const Router = require('koa-router')
const router = new Router()
const action = require('./controller/app')
const question = require('./controller/question')

router.get('/', action.index)
router.get('/spider', action.spider)

router.post('/api/question', question.create)

module.exports = router
