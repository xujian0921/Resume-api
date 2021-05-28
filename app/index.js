const Koa = require('koa')
const koaBody = require('koa-body')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const koaStatic = require('koa-static')
const cors = require('koa2-cors')
const app = new Koa()
const routing = require('./routes')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr,{ useNewUrlParser: true }, () => console.log('MongoDB连接成功了'))
mongoose.connection.on('error', console.error)

app.use(cors())
app.use(koaStatic(path.join(__dirname, 'public'))) //通常静态文件都注册在最前面  //参数就是我们指定的目录 //在public下的文件我们就可以直接通过localhost + 路径访问

app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

app.use(koaBody({
  multipart: true, //支持文件这种格式了
  formidable: {  //node npm包
    uploadDir: path.join(__dirname, '/public/uploads'), //上传目录
    keepExtensions: true  //保留上传文件后缀
  }
}))

app.use(parameter(app))

routing(app)

app.listen(3000,() => {
  console.log('程序在3000端口启动')
})