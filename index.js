const express = require('express')
const passport = require('passport')

let app = express()

let env = process.env.NODE_ENV || 'development'
let config = require('./server/config/config')[env]

require('./server/config/database')(config)
require('./server/config/express')(config, app)
require('./server/config/routes')(app, passport)
require('./server/config/passport')()

app.listen(config.port)
console.log('Express ready!')
