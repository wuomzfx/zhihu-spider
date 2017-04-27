const mongoose = require('mongoose')
const Status = {
  normal: 1,
  expired: -1,
  stoped: 0
}
const Question = new mongoose.Schema({
  title: {
    type: String,
    unique: false
  },
  qid: {
    type: String,
    unique: true
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  expiredTime: {
    type: Date,
    default: () => +new Date() + 7 * 24 * 60 * 60 * 1000
  },
  lastSyncTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number,
    default: Status.normal
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('Question', Question)
