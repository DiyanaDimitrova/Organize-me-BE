let homeController = require('./home-controller')
let usersController = require('./users-controller')
let categoryController = require('./category-controller')
let eventController = require('./event-controller')
let codeController = require('./code-controller')


module.exports = {
  home: homeController,
  users: usersController,
  category: categoryController,
  event: eventController,
  code: codeController
}
