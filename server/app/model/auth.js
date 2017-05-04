const mongoose = require('mongoose')
const Auth = new mongoose.Schema({
  phone: {
    type: String
  },
  email: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  cookie: {
    type: String
  }
})
module.exports = mongoose.model('Auth', Auth)
