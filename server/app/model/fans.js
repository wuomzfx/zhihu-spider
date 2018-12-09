const mongoose = require('mongoose')
const Fans = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    require: true
  },
  url_token: {
    type: String,
    require: false,
    unique: true
  },
  follower_count: Number,
  gender: Number,
  is_followed: Boolean,
  is_following: Boolean,
  avatar_url: String,
  avatar_url_template: String,
  answer_count: {
    type: Number,
    default: 0
  },
  articles_count: {
    type: Number,
    default: 0
  },
  voted: {
    type: Number,
    default: 0
  },
  thanked: {
    type: Number,
    default: 0
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  lastRichTime: {
    type: Date
  }
})
module.exports = mongoose.model('Fans', Fans)
