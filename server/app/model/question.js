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
  isDeleted: {
    type: Boolean,
    default: false
  }
})
