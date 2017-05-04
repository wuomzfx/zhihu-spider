const spider = require('../service/spider')
const App = require('./app')

class Question extends App {
  async login (ctx) {
    ctx.body = await spider.login()
  }
}
module.exports = new Question()
