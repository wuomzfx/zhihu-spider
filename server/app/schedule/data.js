const QuestionModel = require('../model/question')
const AuthModel = require('../model/auth')
const spiderService = require('../service/spider')
const dataService = require('../service/data')

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
    ques.forEach(q => {
      spiderService.getData(auth.cookie, q.qid).then(rs => {
        if (rs.success && rs.data.readers > 0) {
          // const lastData = await dataService.getLastData(rs.data.qid)
          dataService.create(rs.data)
        }
      })
    })
  }
}
