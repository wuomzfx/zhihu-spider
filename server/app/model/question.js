const mongoose = require('../middleware/mongo').mongoose
module.exports = new mongoose.Schema({
  title: {
    type: String,
    unique: false
  },
  url: {
    type: String,
    unique: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})
