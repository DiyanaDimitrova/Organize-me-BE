let Category = require('mongoose').model('Category')

module.exports = {
  create: (req, res) => {
    let category = req.body
    Category
      .create(category)
      .then(category => {
        res.json({message: 'didi'})
      })
      .catch(err => {
        res.json({message: err})
      })
  }
}
