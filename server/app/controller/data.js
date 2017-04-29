const QuestionModel = require('../model/question')
const DataModel = require('../model/data')
const App = require('./app')

class Data extends App {
  async question (ctx) {
    const { qid } = ctx.params
    const question = await QuestionModel.findOne({
      qid: qid
    }).exec()
    const data = await DataModel.find({
      qid: qid
    }).exec()
    ctx.body = {question, data}
  }
}
module.exports = new Data()
