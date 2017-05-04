const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required'

let codeSchema = mongoose.Schema({
  code: {
    type: String,
    required: requiredValidationMessage,
    unique: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  reuseble: {
    type: Boolean,
    default: false
  },
  isReserved: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})

module.exports = mongoose.model('Code', codeSchema)
