let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  create: (req, res) => {
    let user = req.body
    if (user.password !== user.confirmPassword) {
      user.globalError = 'Passwords do not match!'
      res.json({ user: user })
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)
      User
        .create(user)
        .then(user => {
          req.logIn(user, (err) => {
            if (err) {
              res.json({ messages: 'Cannot be registered' })
              return
            }
            res.json({messages: 'OK'})
          })
        })
    }
  },
  authenticate: (req, res) => {
    let inputUser = req.body
    User
      .findOne({ username: inputUser.username })
      .then(user => {
        if (!user.authenticate(inputUser.password)) {
          res.json({messages: 'Invalid username or password'})
        } else {
          req.logIn(user, (err) => {
            if (err) {
              res.send({messages: 'Error'})
              return
            }
            res.send({messages: 'OK', user: {firstName: user.firstName, lastName: user.lastName, username: user.username, roles: user.roles}})
          })
        }
      })
     .catch(error => {
       console.log(error)
     })
  },
  logout: (req, res) => {
    req.logout()
    res.json({
      message: 'OK1',
      success: true
    })
  },
  resetPassword: (req, res) => {
    console.log(req.body)
    let user = req.body
    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, user.password)
    console.log('SALT' + salt)
    console.log('HASH' + hashedPass)
    User
      .findOneAndUpdate({username: user.password}, {$set: {salt: salt, hashedPass: hashedPass}}, {new:true})
      .then(user => {
        console.log('Updated' + JSON.stringify(user))
        res.json({messages: 'Password changed successful.'})
      })
      .catch((err) => {
        res.json({messages: 'Password can not be changed.'})
        console.log(err)
      })
  },
  usersAll: (req, res) => {
    User
      .find()
      .then(users => {
        res.json({users: users})
      })
      .catch((err) => {
        console.log(err)
      })
  },
  adminAdd: (req, res) => {
    User
      .find({ username: { $in: req.body.usersToMakeAdmin } })
      .then((users) => {
        users.forEach(user => {
          if(user.roles.includes(req.body.type)){
            console.log(user.roles)
            console.log(req.body.type)
          } else {
            user.roles.push(req.body.type)
            user.save()
          }
        })
        res.json({message: 'OK'})
      })
      .catch((err) => {
        console.log(err)
        res.json({message: 'Error'})
      })
  }
}
