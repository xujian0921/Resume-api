const Resume = require('../models/resume')
const User = require('../models/users')

class ResumeCtl{

  // async findById(ctx) {

  // }

  async create(ctx) {
    ctx.verifyParams({
      avatar_url: { type: 'string', require: true },
      sign_one: { type: 'string', require: true },
      sign_two: { type: 'string', require: true },
      sign_three: { type: 'string', require: true },
      job_intention: { type: 'string', require: true },
      name: { type: 'string', require: true },
      born: { type: 'string', require: true },
      gender: { type: 'number', require: true },
      native_place: { type: 'string', require: true },
      education: { type: 'number', require: true },
      major: { type: 'string', require: true },
      phone: { type: 'string', require: true },
      email: { type: 'string', require: true }
    })
    const exist = await Resume.find({ userId: ctx.state.user._id })
    if(exist.length !==0 ) {
      ctx.throw(400, '该账号已创建简历')
    }
    const resume = await new Resume({ userId: ctx.state.user._id, ...ctx.request.body }).save()
    ctx.body = resume
  }

  //不能用findByid 查找的是resume的id
  async findSelf(ctx) {
    const resume = await Resume.find({ userId: ctx.state.user._id })
    ctx.body = resume
  }

  async find (ctx) {
    const { pageSize = 20, pageIndex = 1, q = undefined } = ctx.query
    const page_index = Math.max(pageIndex*1, 1) - 1
    const page_size = Math.max(pageSize*1, 1)
    if(q) {
      let data = await Resume
      .find({ $or: [{ name: {$ne: undefined} }] })
      .limit(page_size).skip((page_index * page_size))
      let total = await Resume.find({ $or: [{ name: {$ne: undefined} }] })
      ctx.body = { data, totalCount: total.length }
    } else {
      let data = await Resume
      .find()
      .limit(page_size).skip((page_index * page_size))
      let total = await Resume.find()
      ctx.body = { data, totalCount: total.length }
    }
  }

  async findById(ctx) {
    const { id } = ctx.request.query
    const user = await Resume.find({ userId: id })
    if(!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user
  }

  async findByAccount(ctx) {
    const { account } =ctx.request.query
    const user = await User.find({ account })
    if(!user.length) { ctx.throw(404, '用户不存在') }
    const resume = await Resume.find({ userId: user[0]._id })
    if(!resume) { ctx.throw(404, '请先创建简历信息') }
    ctx.body = resume
  }

  //如果model中userId的select为false,需加上.select('+userId') ，即返回userId字段
  async checkResumeExist(ctx, next) {
    const resume = await Resume.findById(ctx.params.id).select('+userId')
    if(!resume) { ctx.throw(404, '内容不存在') }
    ctx.state.resume = resume
    await next()
  }

  async checkResumeOwner(ctx, next) {
    const {resume} = ctx.state
    console.log(resume)
    if(resume.userId.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }

  async updated(ctx) {
    ctx.verifyParams({
      avatar_url: { type: 'string', require: true },
      sign_one: { type: 'string', require: true },
      sign_two: { type: 'string', require: true },
      sign_three: { type: 'string', require: true },
      job_intention: { type: 'string', require: true },
      name: { type: 'string', require: true },
      born: { type: 'string', require: true },
      gender: { type: 'number', require: true },
      native_place: { type: 'string', require: true },
      education: { type: 'number', require: true },
      major: { type: 'string', require: true },
      phone: { type: 'string', require: true },
      email: { type: 'string', require: true }
    })
    await ctx.state.resume.update(ctx.request.body)
    ctx.body = ctx.state.resume
  }

  async delete(ctx) {
    await Resume.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new ResumeCtl()