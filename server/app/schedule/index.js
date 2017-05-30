const schedule = require('node-schedule')
const data = require('./data')
const topic = require('./topic')

// 每30分钟执行一次
const dataRule = {
  start: new Date(Date.now()),
  rule: '*/30 * * * *'
  // rule: '*/1 * * * * *',
  // end: new Date(+new Date() + 1200)
}
schedule.scheduleJob(dataRule, () => {
  console.log('spider data start')
  data.getAll()
})

// 每3小时15分执行一次
const topicRule = {
  start: new Date(Date.now()),
  rule: '0 15 */3 * * *'
  // rule: '*/1 * * * * *',
  // end: new Date(+new Date() + 1200)
}
schedule.scheduleJob(topicRule, () => {
  console.log('spider topic start')
  topic.get()
})

// 每3小时45分执行一次
const topicPushRule = {
  start: new Date(Date.now()),
  rule: '0 45 */3 * * *'
  // rule: '*/1 * * * * *',
  // end: new Date(+new Date() + 1200)
}
schedule.scheduleJob(topicPushRule, () => {
  console.log('push topic start')
  topic.pushHotQuestions()
})
