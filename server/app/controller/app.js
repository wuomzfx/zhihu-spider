var request = require('request-promise-native')

module.exports = {
  index (ctx) {
    ctx.body = '这是首页'
  },
  async spider (ctx) {
    const rs = await request('http://www.baidu.com').catch(err => {
      return err
    })
    if (rs.error) {
      ctx.body = rs.message
    } else {
      ctx.body = rs
    }
  }
}
