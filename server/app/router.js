const Router = require('koa-router')
const router = new Router()
const action = require('./controller/app')

router.get('/', action.index)
router.get('/spider', action.spider)

module.exports = router
