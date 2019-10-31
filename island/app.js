require('module-alias/register')

const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()
// const router = new Router()
app.use(catchError)
app.use(parser())
InitManager.initCore(app)

// 应用程序对象 中间件
app.listen(3000)