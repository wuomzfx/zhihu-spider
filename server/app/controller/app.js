class App {
  result (result) {
    if (result.status) {
      this.ctx.status = result.status
    }
    if (result.headers) {
      this.handleHeaders(result.headers)
    }
    this.ctx.body = result
  }
  deleteCookie () {
    if (!this.ctx.header.cookie) return
    this.ctx.header.cookie.split('; ').forEach(cookie => {
      const name = cookie.split('=')[0]
      this.ctx.cookies.set(name, null)
    })
  }
  handleHeaders (headers) {
    if (headers['set-cookie']) {
      headers['set-cookie'].forEach(r => {
        const cookie = r.split(';')[0]
        const name = cookie.split('=')[0]
        const value = cookie.replace(`${name}=`, '')
        this.ctx.cookies.set(name, value)
      })
    }
  }
  success (data) {
    this.ctx.body = {
      success: true,
      data: data
    }
  }
  error (error) {
    this.ctx.body = {
      success: false,
      msg: error
    }
  }
}
module.exports = App
