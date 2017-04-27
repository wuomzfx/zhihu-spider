const mongoose = require('mongoose')
const Data = new mongoose.Schema({
  qid: {
    type: String
  },
  followers: Number,
  readers: Number,
  answers: Number,
  createTime: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Data', Data)
