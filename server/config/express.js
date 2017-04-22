const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const methodOverride = require('method-override')

module.exports = (config, app) => {
  app.set('view engine', 'pug')
  app.set('views', config.rootPath + 'server/views')

  app.use(cookieParser())
  // app.use(bodyParser())
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false, type: 'application/x-www-form-urlencoding' }))
  app.use(methodOverride('_method'))
  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }
    next()
  })
  app.use(cors())
  app.use(express.static(config.rootPath + 'public'))
}
