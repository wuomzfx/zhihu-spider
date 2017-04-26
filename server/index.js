const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mongoose = require('./app/middleware/mongo')
const path = require('path')
const cors = require('koa2-cors')
const router = require('./app/router.js')

const app = new Koa()

app.use(cors())
app.use(bodyParser())
app.use(mongoose({
  user: '',
  pass: '',
  host: '127.0.0.1',
  port: 27017,
  database: 'zhihu',
  schemas: path.resolve(__dirname, './app/model'),
  db: {
    native_parser: true
  }
}))
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
