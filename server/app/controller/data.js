const QuestionModel = require('../model/question')
const DataModel = require('../model/data')
const App = require('./app')

class Data extends App {
  async question () {
    const { qid } = this.ctx.params
    const question = await QuestionModel.findOne({
      qid: qid
    }).exec()
    const data = await DataModel.find({
      qid: qid
    }).sort({
      createTime: -1
    }).exec()
    this.ctx.body = {question, data}
  }
}
module.exports = new Data()
