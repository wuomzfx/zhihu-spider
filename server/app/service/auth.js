const request = require('request-promise-native')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async login (params, cookie) {
    console.log(params)
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
    const rs = await request.post(options).on('response', function (response) {
      res = response
    }).catch(err => {
      return err
    })
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
