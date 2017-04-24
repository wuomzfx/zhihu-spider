const Koa = require('koa')
const router = require('./app/router.js')
const mongoose = require('./app/middleware/mongo')
const path = require('path')
const app = new Koa()
app.use(mongoose({
  user: '',
  pass: '',
  host: '127.0.0.1',
  port: 27017,
  database: 'zhihu',
  schemas: path.join(__dirname, '/app/model'),
  db: {
    native_parser: true
  }
}))
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
