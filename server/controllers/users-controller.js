let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')
let Instagram = require('mongoose').model('Instagram')

module.exports = {
  register: (req, res) => {
    res.render('users/register')
  },
  create: (req, res) => {
    let user = req.body
    console.log(user)

    if (user.password !== user.confirmPassword) {
      user.globalError = 'Passwords do not match!'
      console.log('111' + user)
      res.json({ user: user })
      // res.render('users/register', user)
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)
      User
        .create(user)
        .then(user => {
          req.logIn(user, (err) => {
            if (err) {
              res.json({ messages: 'Cannot be registered' })
              // res.render('users/register', { globalError: 'Ooops 500' })
              return
            }
            console.log('222' + user)
            res.json({messages: 'OK'})
            // res.redirect('/')
          })
        })
    }
  },
  login: (req, res) => {
    res.render('users/login')
  },
  authenticate: (req, res) => {
    let inputUser = req.body
    User
      .findOne({ username: inputUser.username })
      .then(user => {
        if (!user.authenticate(inputUser.password)) {
          res.json({messages: 'Invalid username or password'})
          //  res.render('users/login', { globalError: 'Invalid username or password' })
        } else {
            // req.logIn(user)
          req.logIn(user, (err) => {
            if (err) {
              res.send({messages: 'Error'})
              // res.render('users/login', { globalError: 'Ooops 500' })
              return
            }
            res.send({messages: 'OK', user: {firstName: user.firstName, lastName: user.lastName}})
            // res.json({user: user, message: 'OK'})
            // res.redirect('/')
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
    res.redirect('/')
  },
  adminAll: (req, res) => {
    User
      .find({roles: 'Admin'})
      .then(users => {
        console.log(users)
        res.json({users: users})
        res.render('users/all', {users: users})
      })
      .catch((err) => {
        console.log(err)
      })
  },
  adminView: (req, res) => {
    res.render('users/add')
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
  },
  profileInstagrams: (req, res) => {
    console.log(req.params.username)
    User
    .findOne({username: req.params.username})
    .then(user => {
      console.log(user)
      Instagram
        .find({'tags.userTags': user.username})
        .limit(100)
        .sort({date: -1})
        .then(photosByUser => {
          console.log(photosByUser)
          photosByUser.forEach((photo) => {
            Instagram.findByIdAndUpdate({ _id: photo._id }, {$inc: { views: 1 }}, function (err, data) {
              if (err) console.log(err)
            })
          })
          res.render('users/profile', {user: user, photosByUser: photosByUser})
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
    })
  }
}
