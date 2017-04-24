const Koa = require('koa')
const router = require('./app/router.js')
const app = new Koa()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
