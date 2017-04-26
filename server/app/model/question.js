const mongoose = require('../middleware/mongo').mongoose
module.exports = new mongoose.Schema({
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
  lastSyncTime: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})
