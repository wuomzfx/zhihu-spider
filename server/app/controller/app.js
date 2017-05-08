const handleHeaders = (ctx, result) => {
  if (result.headers['set-cookie']) {
    result.headers['set-cookie'].forEach(r => {
      const cookie = r.split(';')[0]
      const name = cookie.split('=')[0]
      const value = cookie.replace(`${name}=`, '')
      ctx.cookies.set(name, value)
    })
  }
  delete result.headers
}
class App {
  result (ctx, result) {
    if (result.status) {
      ctx.status = result.status
    }
    if (result.headers) {
      handleHeaders(ctx, result)
    }
    ctx.body = result
  }
  deleteCookie (ctx) {
    if (!ctx.header.cookie) return
    ctx.header.cookie.split('; ').forEach(cookie => {
      const name = cookie.split('=')[0]
      ctx.cookies.set(name, null)
    })
  }
  handleHeaders (ctx, result) {
    return handleHeaders(ctx, result)
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
