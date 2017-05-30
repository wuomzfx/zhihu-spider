const mongoose = require('mongoose')
const Auth = new mongoose.Schema({
  uid: {
    type: String,
    unique: true,
    required: true
  },
  urlToken: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
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
  topics: {
    type: Array,
    default: []
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
