const mongoose = require('mongoose')

const { Schema, model } = mongoose

const imageSchema = new Schema({
  __v: { type: Number, select: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: true},
  image_url: { type: String, required: true },
  image_name: { type: String, required: true },
}, { timestamps: true })

module.exports = model('Image', imageSchema)

//required: true 新建用户必须含有该字段