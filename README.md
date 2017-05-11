# 答乎
爬取知乎题目，定时抓取评论数、回答数、阅读数，跟踪分析题目热度走势，并图表呈现。目前有如下功能：
1. 知乎帐号登陆；
2. 跟踪问题，定时爬取；
3. 搜索问题；
4. 发现问题。
## 如何使用
目前只支持自己搭建服务器使用

### 开发
1. cd server && npm run dev
2. cd client && npm run dev

### 线上
1. /client/config/index.js 中设置好线上server地址
2. cd server && npm start
3. cd client && npm run build

## 注意与声明
**此系统仅作学习与个人使用！**
系统通过爬虫技术，使得可以通过知乎帐户登陆，但会在数据库存下用户的知乎cookie，请不要用此系统为非作歹。

