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
            res.send({messages: 'OK', user: {firstName: user.firstName, lastName: user.lastName}})
          })
        }
      })
     .catch(error => {
       console.log(error)
     })
  },
  logout: (req, res) => {
    req.logout()
    res.json({message: 'OK1'})
  },
  adminAll: (req, res) => {
    User
      .find({roles: 'Admin'})
      .then(users => {
        res.json({users: users})
      })
      .catch((err) => {
        console.log(err)
      })
  },
  adminAdd: (req, res) => {
    User
      .findOne({username: req.body.username})
      .then(user => {
        if (user) {
          user.roles.push('Admin')
          user.save()
          res.redirect('/')
        } else {
          let globalError = 'Please make admin registered user!'
          res.render('users/add', { globalError: globalError })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
