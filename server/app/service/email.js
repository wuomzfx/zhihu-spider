const nodemailer = require('nodemailer')
const config = require('../config/email')
const transporter = nodemailer.createTransport(config.transporter)
const send = (email, content) => {
  const mailOptions = {
    from: `答乎 <${config.transporter.auth.user}>`,
    to: email,
    subject: 'Hello ✔',
    text: content,
    html: '<b>Hello world ?</b>'
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
  })
}
module.exports = {
  sendAct (ctx, next) {
    console.log(this.send)
    send('75851654@qq.com', 'hhhhh')
    ctx.body = 'success'
  }
}
