const mongoose = require('mongoose')
const Auth = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  cookie: {
    type: String
  },
  status: {
    type: Number,
    required: true,
    default: 1
  },
  createTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastLoginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiredTime: {
    type: Date,
    required: true,
    default: Date.now
  }
})
module.exports = mongoose.model('Auth', Auth)
