const mongoose = require('mongoose')
const HotQuestion = new mongoose.Schema({
  qid: {
    type: String,
    unique: false
  },
  topicId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: false
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  },
  totalTimes: {
    type: Number,
    default: 1
  },
  times: {
    type: Number,
    default: 1
  },
  pushed: {
    type: Boolean,
    default: false
  }
})

HotQuestion.index({ topicId: 1, qid: 1 }, { unique: true })

module.exports = mongoose.model('HotQuestion', HotQuestion)
