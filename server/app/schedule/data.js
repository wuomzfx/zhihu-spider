const QuestionModel = require('../model/question')
const DataModel = require('../model/data')
const spider = require('../service/spider')

module.exports = {
  async get () {
    const cond = {
      status: 1
    }
    const ques = await QuestionModel
                              .find(cond)
                              .sort({createTime: -1})
                              .exec()
    const dataArr = []
    const promises = ques.map(q => {
      return spider.getData(q.qid).then(rs => {
        // console.log(rs)
        dataArr.push(rs.data)
      })
    })
    await Promise.all(promises)
    DataModel.create(dataArr)
  }
}
