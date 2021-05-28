const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  account: { type: String, required: true },
  password: { type: String, required: true, select:false },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  avatar_url: { type: String, required: false },
  gender: { type: String, required: true }

}, { timestamps: true })

module.exports = model('User', userSchema)

//required: true 新建用户必须含有该字段