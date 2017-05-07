const QuestionModel = require('../model/question')
const DataModel = require('../model/data')
const AuthModel = require('../model/auth')
const spiderService = require('../service/spider')

module.exports = {
  async getAll () {
    const cond = {
      status: 1,
      expiredTime: {
        $gt: new Date()
      }
    }
    const auths = await AuthModel
                        .find(cond)
                        .sort({createTime: -1})
                        .exec()
    auths.forEach(a => {
      this.get(a)
    })
  },
  async get (auth) {
    const cond = {
      status: 1,
      userId: auth._id
    }
    const ques = await QuestionModel
                              .find(cond)
                              .sort({createTime: -1})
                              .exec()
    // 并发请求，容易被封
    // const dataArr = []
    // const promises = ques.map(q => {
    //   return spiderService.getData(q.qid).then(rs => {
    //     // console.log(rs)
    //     if (rs.success && rs.data.readers > 0) {
    //       dataArr.push(rs.data)
    //     }
    //   })
    // })
    // await Promise.all(promises)
    // if (dataArr.length > 0) {
    //   DataModel.create(dataArr)
    // }
    ques.forEach(q => {
      spiderService.getData(auth.cookie, q.qid).then(rs => {
        if (rs.success && rs.data.readers > 0) {
          new DataModel(rs.data).save()
        }
      })
    })
  }
}
