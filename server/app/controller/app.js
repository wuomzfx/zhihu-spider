class App {
  constructor () {
    this.success = this.success.bind(this)
    this.error = this.error.bind(this)
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
      error: error
    }
  }
}
module.exports = App
