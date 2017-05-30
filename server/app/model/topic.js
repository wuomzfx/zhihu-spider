const mongoose = require('mongoose')
const Topic = new mongoose.Schema({
  topicId: {
    type: Number,
    require: true,
    unique: true
  },
  name: {
    type: String,
    require: true
  },
  urlToken: {
    type: Number,
    require: true,
    unique: true
  },
  followers: {
    type: Number,
    default: 1
  },
  lastSpiderTime: {
    type: Date,
    default: Date.now
  },
  createTime: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Topic', Topic)
