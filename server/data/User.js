const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

let requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: { type: String, required: requiredValidationMessage, unique: true },
  firstName: { type: String, required: requiredValidationMessage },
  lastName: { type: String, required: requiredValidationMessage },
  email: {type: String, required: requiredValidationMessage},
  salt: String,
  hashedPass: String,
  roles: [{
    type: String,
    enum: ['Normal','Admin']
  }]
})
userSchema.pre('save',function(next) {
  if (this.roles.length == 0) {
    this.roles.push('Normal')
  }
  next()
})
userSchema.method({
  authenticate: function (password) {
    let inputHashedPassword = encryption.generateHashedPassword(this.salt, password)
    if (inputHashedPassword === this.hashedPass) {
      return true
    } else {
      return false
    }
  }
})

let User = mongoose.model('User', userSchema, 'users')

module.exports.seedAdminUser = () => {
  User.find({}).then(users => {
    if (users.length === 0) {
      let salt = encryption.generateSalt()
      let hashedPass = encryption.generateHashedPassword(salt, 'Admin12')
      User.create({
        username: 'Admin',
        firstName: 'Admin',
        lastName: 'Adminov',
        email: 'admin@admin.com',
        salt: salt,
        hashedPass: hashedPass,
        roles: ['Admin']
      })
    }
  })
}
