const path = require('path')
const Image = require('../models/image')

class HomeCtl {
  index(ctx) {
    ctx.body = '<h1>这是主页<h1>'
  }

  upload(ctx) {
    //app -> index 设置上传到uploads文件夹
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
  }

  async saveImage(ctx) {
    ctx.verifyParams({
      image_url: { type: 'string', require: true },
      image_name: { type: 'string', require: true }
    })
    const url = await new Image({ userId: ctx.state.user._id, ...ctx.request.body }).save()
    ctx.body = url
  }

  async getImageUrl(ctx) {
    const image_url = await Image.find({ userId: ctx.state.user._id })
    ctx.body = image_url
  }
}

module.exports = new HomeCtl()