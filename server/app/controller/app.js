class App {
  success (ctx, data) {
    ctx.body = {
      success: true,
      data: data
    }
  }
  error (ctx, error) {
    ctx.body = {
      success: false,
      error: error
    }
  }
}
module.exports = App
