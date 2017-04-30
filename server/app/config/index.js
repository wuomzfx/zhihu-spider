const port = process.env.NODE_ENV === 'prod' ? '80' : '3000'
module.exports = {
  zhihu: {
    root: 'https://www.zhihu.com'
  },
  port: port,
  db: {
    url: 'mongodb://localhost:27017/zhihu',
    host: '127.0.0.1',
    port: 27017,
    database: 'zhihu'
  }
}
