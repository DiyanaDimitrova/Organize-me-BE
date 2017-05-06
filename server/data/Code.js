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
  user: {
    type: String,
    required: requiredValidationMessage
  },
  event : {
    type: String,
    required: requiredValidationMessage
  }
})

module.exports = mongoose.model('Code', codeSchema)
