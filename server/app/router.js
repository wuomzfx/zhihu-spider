const Router = require('koa-router')
const router = new Router()
const data = require('./controller/data')
const question = require('./controller/question')

// router.get('/', action.index)
// router.get('/spider', action.spider)

router.post('/api/question', question.create)
router.get('/api/question', question.get)

router.get('/api/data/question', data.question)

module.exports = router
