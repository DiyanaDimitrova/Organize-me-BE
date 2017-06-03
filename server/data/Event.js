const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required'

let eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: requiredValidationMessage,
    maxlength: 50
  },
  date: {
    type: Date,
    required: requiredValidationMessage
  },
  time: {
    type: Date,
    required: requiredValidationMessage
  },
  place: {
    type: String,
    required: requiredValidationMessage,
    maxlength: 50
  },
  city: {
    type: String,
    required: requiredValidationMessage,
    maxlength: 50
  },
  fileId: {
    type: String,
    required: requiredValidationMessage
  },
  categoryId: {
    type: String
  },
  capacity: {
    type: Number
  },
  details: {
    type: String,
    required: requiredValidationMessage
  },
  invitedPeople: [],
  user: {
    type: String,
    required: requiredValidationMessage
  }
})

mongoose.model('Event', eventSchema)
