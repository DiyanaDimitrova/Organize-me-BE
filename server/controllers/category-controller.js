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
  },
  getAll: (req, res) => {
    Category
      .find()
      .then(categories => {
        res.json({categories: categories})
      })
      .catch(err => {
        console.log(err)
      })
  },
  update: (req, res) => {
    let title = req.body.title
    let user = req.body.user
    console.log(req.body)
    Category
      .findByIdAndUpdate(req.params.id, {
        $set: { title: title, user: user }
      })
      .exec()
      .then(() => {
        res.json({message: 'OK'})
      })
      .catch((err) => {
        console.log(err)
        res.json({message: err})
      })
  },
  delete: (req, res) => {
    console.log(req.body)
    Category
     .findByIdAndRemove(req.params.id)
     .then(() => {
       res.json({message: 'OK'})
     })
     .catch((err) => {
       console.log(err)
       res.json({message: err})
     })
  },
  getCategory: (req, res) => {
    Category
      .findById(req.params.id)
      .then((category) => {
        res.json({category: category})
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
