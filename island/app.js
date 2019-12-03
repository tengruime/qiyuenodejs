require('module-alias/register')

const Koa = require('koa')
const parser = require('koa-bodyparser')
const path = require('path')

const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
const static = require('koa-static')

const app = new Koa()
// const router = new Router()
app.use(catchError)
app.use(parser())
app.use(static(path.join(__dirname,'./static')))

InitManager.initCore(app)

// 应用程序对象 中间件
app.listen(3000)