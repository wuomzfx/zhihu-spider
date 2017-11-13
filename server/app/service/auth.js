const request = require('request-promise-native')
const AuthModel = require('../model/auth')
const spider = require('./spider')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async get (userId) {
    return AuthModel.findOne({
      _id: userId
    })
  },
  async check (userId) {
    const err = {
      success: false,
      status: 302,
      redirectUrl: '/login',
      msg: 'cookie失效'
    }
    if (!userId) {
      return err
    }
    const auth = await this.get(userId)
    if (auth && auth.cookie && auth.expiredTime > new Date()) {
      return {
        success: true,
        auth
      }
    } else {
      return err
    }
  },
  buildCookie (cookies) {
    let date
    const data = cookies.map(c => {
      if (c.indexOf('z_c0') >= 0) {
        date = new Date(c.split(';')[2].replace('expires=', ''))
        // return c.split(';')[0]
      }
      return c.split(';')[0] + ';'
    }).join(' ')
    return {
      data: data.substring(0, data.length - 1),
      expires: date
    }
  },
  async updateUserInfo (auth) {
    const rs = await spider.getUserInfo(auth.cookie)
    if (!rs.success) {
      return rs
    }
    const update = await this.updateAuth(auth._id, rs.data)
    if (update) {
      return {
        success: true,
        data: update
      }
    } else {
      return {
        success: false,
        msg: '更新失败'
      }
    }
  },
  async updateAuth (authId, data) {
    return AuthModel.findOneAndUpdate({
      _id: authId
    }, data, { new: true })
  },
  async upsertAuth (params, headers) {
    const cookieData = this.buildCookie(headers['set-cookie'])
    const userInfo = await spider.getUserInfo(cookieData.data)
    if (!userInfo.success || !userInfo.data.uid) {
      return false
    }
    const cond = {
      uid: userInfo.data.uid
    }
    const newAuth = Object.assign(userInfo.data, {
      cookie: cookieData.data,
      expiredTime: cookieData.expires,
      lastLoginTime: new Date()
    })
    if (params.phone_num) newAuth.phone_num = params.phone_num
    if (params.email) newAuth.email = params.email
    const rs = await AuthModel.findOneAndUpdate(cond, newAuth, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
    return rs
  },
  getCondByParams (params) {
    const cond = {}
    if (params.phone_num) cond.phone = params.phone_num
    if (params.email) cond.email = params.email
    return cond
  },
  async isLogined (params) {
    const rs = await AuthModel.findOne(this.getCondByParams(params))
    if (rs && rs.expiredTime > new Date()) {
      return {
        success: true,
        auth: rs
      }
    } else {
      return {
        success: false
      }
    }
  },
  async login (params, cookie) {
    const isLogined = await this.isLogined(params)
    if (isLogined.success) {
      return isLogined
    }
    const url = params.email ? 'email' : 'phone_num'
    const options = {
      url: `${zhihuRoot}/login/${url}`,
      form: params,
      headers: {
        'Origin': zhihuRoot,
        'Host': 'www.zhihu.com',
        'Cookie': cookie,
        'X-Xsrftoken': params._xsrf,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    }
    let res
    let rs = await request.post(options).on('response', function (response) {
      res = response
    }).catch(err => {
      return err
    })
    if (typeof (rs) === 'string') {
      try {
        rs = JSON.parse(rs)
      } catch (e) {
        console.log(typeof (rs))
        console.log(e)
      }
    }
    if (rs.error) {
      return {
        success: false,
        status: rs.statusCode,
        msg: rs.message
      }
    }
    if (rs.errcode) {
      return {
        success: false,
        status: 400,
        data: rs.data,
        msg: rs.msg
      }
    }
    return {
      headers: res.headers,
      success: true,
      data: rs
    }
  },
  updateTopic (userId, topics) {
    return AuthModel.findOneAndUpdate({
      _id: userId
    }, { topics }, { new: true })
  }
}
