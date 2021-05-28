const mongoose = require('mongoose')

const { Schema, model } = mongoose

const resumeSchema = new Schema({
  __v: { type: Number, select: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: true},
  avatar_url: { type: String, required: false },
  sign_one: { type: String, required: false },
  sign_two: { type: String, required: false },
  sign_three: { type: String, required: false },
  job_intention: { type: String, required: false },
  name: { type: String, required: true },
  born: { type: String, required: true },
  gender: { type: Number, enum: [0, 1], default: 1, required: true },
  native_place: { type: String, required: false },
  education: { type: Number, enum: [0, 1, 2, 3, 4], default: 1, required: true },
  major: { type: String, required: false },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  skill: { type: String, required: true },
  summary: { type: String, required: true },
  experience: {
    type: [{
      company: { type: String, required: true },
      time: { type: String, required: true },
      project: {
        type: [{
          project_name: { type: String, required: false },
          project_background: { type: String, required: false },
          project_analysis: { type: String, required: false },
          project_complete: { type: String, required: false },
          project_summary: { type: String, required: false },
          project_img: { type: String, required: false },
        }]
      }
    }]
  },
}, { timestamps: true })

module.exports = model('Resume', resumeSchema)