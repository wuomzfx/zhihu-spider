const DataModel = require('../model/data')

module.exports = {
  async create (data) {
    // const lastData = await this.getLastData(data.qid)
    // if (lastData) {
    //   data = this.buildIncrement(data, lastData)
    // }
    return new DataModel(data).save()
  },
  async getLastData (qid) {
    return (await DataModel.find({
      qid: qid
    }).sort({createTime: -1}).limit(1))[0]
  },
  async getGroupData (qids) {
    return DataModel.aggregate([
      { $match: {
        qid: {$in: qids}
      }},
      { $sort: {createTime: -1} },
      { $group: {
        _id: '$qid',
        followers: {$first: '$followers'},
        readers: {$first: '$readers'},
        answers: {$first: '$answers'},
        createTime: {$first: '$createTime'}
      }}
    ])
  },
  buildIncrement (currentData, lastData) {
    const interval = Date.now() - lastData.createTime
    // const hourInterval = (interval / 1000 / 60 / 60)
    const keys = ['answers', 'followers', 'readers']
    currentData.interval = interval
    currentData.increment = {}
    currentData.increaseRate = {}
    keys.forEach(k => {
      const increment = (currentData[k] - lastData[k]) // 增长量
      currentData.increment[k] = increment
      currentData.increaseRate[k] = increment / lastData[k] // 增长率
    })
    return currentData
  }
}
