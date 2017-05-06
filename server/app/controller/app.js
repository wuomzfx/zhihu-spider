const handleCookie = (ctx, result) => {
  if (result.headers['set-cookie']) {
    const cookies = result.headers['set-cookie'].map(r => {
      return r.split(';')[0] + ';'
    })
    ctx.set('set-cookie', cookies)
  }
}
class App {
  result (ctx, result) {
    if (result.status) {
      ctx.status = result.status
    }
    handleCookie(ctx, result)
    ctx.body = result
  }
  handleCookie (ctx, result) {
    return handleCookie(ctx, result)
  }
  success (ctx, data) {
    ctx.body = {
      success: true,
      data: data
    }
  }
  error (ctx, error) {
    ctx.body = {
      success: false,
      msg: error
    }
  }
}
module.exports = App
