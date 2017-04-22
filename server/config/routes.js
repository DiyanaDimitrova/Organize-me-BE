const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)
  app.post('/users/create', controllers.users.create)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)
  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.adminAll)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.adminAdd)
  app.post('/category/add', controllers.category.create)
  app.get('/category/all', controllers.category.getAll)
  app.put('/category/update/:id', controllers.category.update)
  app.delete('/category/delete/:id', controllers.category.delete)
  app.post('/event/add', controllers.event.create)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('Not Found')
    res.end()
  })
}
