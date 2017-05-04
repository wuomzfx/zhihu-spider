const request = require('request-promise-native')
const config = require('../config')
const zhihuRoot = config.zhihu.root

module.exports = {
  async login (params) {
    console.log(params)
    const options = {
      url: `${zhihuRoot}/login/phone_num`,
      form: params,
      headers: {
        'Origin': zhihuRoot,
        'Host': 'www.zhihu.com',
        'X-Xsrftoken': params._xsrf
      }
    }
    const rs = await request.post(options).catch(err => {
      return err
    })
    // if (rs.error) {
    //   return {
    //     success: false,
    //     status: rs.statusCode,
    //     msg: rs.message
    //   }
    // }
    return rs
  }
}
