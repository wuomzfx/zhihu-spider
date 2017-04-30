class App {
  result (ctx, result) {
    if (result.status) {
      ctx.status = result.status
    }
    ctx.body = result
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
