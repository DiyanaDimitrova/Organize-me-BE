const busboyBodyParser = require('busboy-body-parser')
const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

// user routes
  app.post('/users/create', controllers.users.create)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.adminAll)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.adminAdd)

// category routes
  app.post('/category/add', controllers.category.create)
  app.get('/category/all', controllers.category.getAll)
  app.put('/category/update/:id', controllers.category.update)
  app.delete('/category/delete/:id', controllers.category.delete)

// event routes
  app.post('/event/add', busboyBodyParser({limit: '5mb'}), controllers.event.create)
  app.get('/event/all', controllers.event.getAll)
  app.put('/event/update/:id', controllers.event.update)
  app.delete('/event/delete/:id', controllers.event.delete)
  app.get('/event/image/:id', controllers.event.getImage)
  app.get('/event/details/:id', controllers.event.view)
  app.put('/event/attend/:id', controllers.event.attendEvent)

// code routes
  // app.get('/codes/avaible', controllers.codes.avaible)
  app.post('/codes/changeReservedStatus/:id', controllers.code.changeReservedStatus)
  app.post('/codes/create', controllers.code.create)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('Not Found')
    res.end()
  })
}
