let homeController = require('./home-controller')
let usersController = require('./users-controller')
let categoryController = require('./category-controller')

module.exports = {
  home: homeController,
  users: usersController,
  category: categoryController
}
