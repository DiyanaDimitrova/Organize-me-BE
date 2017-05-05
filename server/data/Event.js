const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required'

let eventSchema = mongoose.Schema({
  title: { type: String, required: requiredValidationMessage, maxlength: 50 },
  date: { type: Date, required: requiredValidationMessage },
  time: { type: Date, required: requiredValidationMessage },
  place: { type: String, required: requiredValidationMessage, maxlength: 50 },
  fileId: { type: String, required: requiredValidationMessage },
  creatorId: { type: String },
  categoryId: { type: String },
  capacity: { type: Number },
  details: {type: String, required: requiredValidationMessage},
  invitedPeople: []
})

mongoose.model('Event', eventSchema)
