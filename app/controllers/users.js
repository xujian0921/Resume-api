const User = require('../models/users')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

class UsersCtl {

  async getUser(ctx) {
    const { pageSize = 20, pageIndex = 1, q = undefined } = ctx.query
    const page_index = Math.max(pageIndex*1, 1) - 1
    const page_size = Math.max(pageSize*1, 1)
    let data, total
    if(q) {
      data = await User
      .find({ account: q  })
      .limit(page_size).skip((page_index * page_size))
      total = await User.find({ account: q })
    } else {
      data = await User
      .find()
      .limit(page_size).skip((page_index * page_size))
      total = await User.find()
    }
    ctx.body = {
      data,
      totalCount: total.length
    }
  }

  async getPersonUser(ctx) {
    const user = await User.findById(ctx.state.user._id)
    ctx.body = user
  }

  async register(ctx) {
    ctx.verifyParams({
      account: { type: 'string', required: true },
      password: { type: 'string',  required: true },
      name: { type: 'string', required: true },
      phone: { type: 'number',  required: true },
      gender: { type: 'string',  required: true }
    })
    const checkUser = await User.findOne({ account: ctx.request.body.account })
    if(checkUser) { ctx.throw(400, '用户名已存在') }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async login(ctx) {
    ctx.verifyParams({
      account: { type: 'string', required: true },
      password: { type:'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if(!user) { ctx.throw(400, '用户名或密码不正确') }
    const { _id, account } = user
    const token = jsonwebtoken.sign({ _id, account }, secret, { expiresIn: '3d' })
    ctx.body = { token }
  }

  async checkOwner(ctx, next) {
    if(ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
 
  async updated(ctx) {
    ctx.verifyParams({
      account: { type: 'string', required: false },
      name: { type: 'string', required: false },
      phone: { type: 'number',  required: false },
      gender: { type: 'string',  required: false },
      avatar_url: { type: 'string', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if(!user) { ctx.throw(404, '用户不存在') }
    ctx.status = 204
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user) { ctx.throw(404, '用户不存在') }
    ctx.status = 204
  }

}

module.exports = new UsersCtl()