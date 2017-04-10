const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required'

let categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: requiredValidationMessage,
    maxlength: 50
  }
})

mongoose.model('Category', categorySchema)
