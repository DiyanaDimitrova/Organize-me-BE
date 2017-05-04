// let Code = require('mongoose').model('Code')
let Code = require('../data/Code')
module.exports = {
  create: (req, res) => {
    let code = req.body
    Code
      .create(code)
      .then(code => {
        res.json({message: 'OK'})
      })
      .catch(err => {
        res.json({message: err})
      })
  },
  changeReservedStatus: (req, res) => {
    let id = req.params.id
    Code
      .findById(id)
      .then(code => {
        Code
          .findByIdAndUpdate(id, {
            $set: {isReserved: !code.isReserved}
          })
          .exec()
          .then(() => {
            res.json({message: 'OK'})
          })
          .catch((err) => {
            console.log(err)
            res.json({message: err})
          })
      })
      .catch((err) => {
        console.log(err)
        res.json({message: err})
      })
  }
  // avaible: (req, res) => {
  //   let allCodes = {}
  //   Code
  //     .find({
  //       'isUsed': 'false'
  //     })
  //     .then(codes => {
  //       allCodes.allAvaible = codes
  //       console.log('all codes that are not used:' + allCodes.allAvaible)
  //       res.render('codes/avaible', {allCodes: allCodes})
  //     })
  // }
}
