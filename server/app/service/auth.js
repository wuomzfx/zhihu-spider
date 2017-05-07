const request = require('request-promise-native')
const AuthModel = require('../model/auth')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
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
    const auth = await AuthModel.findOne({
      _id: userId
    })
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
  async upsertAuth (phone, headers) {
    const cookieData = this.buildCookie(headers['set-cookie'])
    const rs = await AuthModel.findOneAndUpdate({
      phone: phone
    }, {
      phone: phone,
      cookie: cookieData.data,
      expiredTime: cookieData.expires,
      lastLoginTime: new Date()
    }, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true
    })
    return rs
  },
  async login (params, cookie) {
    const options = {
      url: `${zhihuRoot}/login/phone_num`,
      form: params,
      headers: {
        'Origin': zhihuRoot,
        'Host': 'www.zhihu.com',
        'Cookie': cookie,
        'X-Xsrftoken': params._xsrf
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
        data: rs.data,
        msg: rs.msg
      }
    }
    return {
      headers: res.headers,
      success: true,
      data: rs
    }
  }
}
