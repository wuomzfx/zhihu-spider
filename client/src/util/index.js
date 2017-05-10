module.exports.handleError = (err) => {
  if (!err.response) {
    window.console.log(err)
    throw err
  }
  const res = err.response
  if (res.status === 302 && res.data.redirectUrl) {
    window.location.href = `#${res.data.redirectUrl}`
    throw err
  }
  if (res.msg) {
    window.alert(res.msg)
    throw err
  }
  if (res.data.msg) {
    window.alert(res.data.msg)
    throw err
  }
  window.console.log(res)
  throw err
}
