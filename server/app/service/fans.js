const FansModel = require('../model/fans')

module.exports = {
  async update (cond, update) {
    return FansModel.update(cond, update)
  },
  async upsert (fans) {
    const cond = {}
    return FansModel.update(cond, fans, {
      upsert: true,
      multi: true
    })
  },
  async insertMany (fans) {
    return FansModel.insertMany(fans)
  },
  async drop () {
    return FansModel.collection.drop()
  },
  async get ({ page = 1, size = 20 } = {}, sort = {}, query = {}) {
    return FansModel.find(query)
      .sort(sort)
      .skip((page - 1) * size)
      .limit(size)
  },
  async getBeRichFans ({ page = 1, size = 20 } = {}, richTime) {
    return FansModel.find({
      $or: [
        {
          lastRichTime: null
        },
        {
          lastRichTime: {
            $lt: richTime
          }
        }
      ]
    })
      .skip((page - 1) * size)
      .limit(size)
  }
}
