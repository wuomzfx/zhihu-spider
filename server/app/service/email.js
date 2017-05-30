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
  },
  send (to, subject, html) {
    const mailOptions = {
      from: `答乎 <${config.transporter.auth.user}>`,
      to: to,
      subject: subject,
      html: html
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      console.log('Message %s sent: %s', info.messageId, info.response)
    })
  },
  sendHotQuestions (email, questions) {
    const content = questions.map(q => this.buildQuestionContent(q)).join()
    const html = `<ol>${content}</ol>`
    this.send(email, '知乎有热门问题', html)
  },
  buildQuestionContent (q) {
    return `
      <li>
        ${q.title}
        <span>&nbsp&nbsp&nbsp&nbsp出现次数：${q.times}</span>
        <p>&nbsp&nbsp&nbsp&nbsp链接地址：www.zhihu.com/question/${q.qid}</p>
      </li>`
  }
}
