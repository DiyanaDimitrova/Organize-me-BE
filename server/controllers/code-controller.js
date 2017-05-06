let Event = require('mongoose').model('Event')
let Code = require('mongoose').model('Code')
let User = require('mongoose').model('User')
let email = require('../utilities/email')
let crypto = require('crypto')
let algorithm = 'aes-256-ctr'
let password = 'solarstone'

let encrypt = (text) => {
  let cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}
let decrypt = (text) => {
  let decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  let obj = JSON.parse(dec)
  return obj
}
let createCryptedObj = (req, obj) => {
  let cryptString = {
    'firstName': obj.firstName,
    'lastName': obj.lastName,
    'email': obj.email
  }
  let hw = encrypt(JSON.stringify(cryptString))
  // console.log('HW' + hw)
  return hw
  // req.session.cryptString = hw
  // console.log('encrypted string created !')
}

module.exports = {
  listInvited: (req, res) => {
    Event
   .findById(req.params.id)
  .then((event) => {
    res.json({invitedPeople: event.invitedPeople})
  })
  .catch((err) => {
    console.log(err)
    res.json({message: err})
  })
  },
  sendCode: (req, res) => {
    console.log(req.body)
    Event
     .findById(req.body.eventId)
     .then((event) => {
       User
       .find({ username: { $in: req.body.usersToSendCode } })
       .then((users) => {
         users.forEach(user => {
          //  console.log('USER' + JSON.stringify(user))
           email.sendTicket(createCryptedObj(req, user), user, event)
         })
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
  // create: (req, res) => {
  //   let code = req.body
  //   Code
  //     .create(code)
  //     .then(code => {
  //       res.json({message: 'OK'})
  //     })
  //     .catch(err => {
  //       res.json({message: err})
  //     })
  // },
  // changeReservedStatus: (req, res) => {
  //   let id = req.params.id
  //   Code
  //     .findById(id)
  //     .then(code => {
  //       Code
  //         .findByIdAndUpdate(id, {
  //           $set: {isReserved: !code.isReserved}
  //         })
  //         .exec()
  //         .then(() => {
  //           res.json({message: 'OK'})
  //         })
  //         .catch((err) => {
  //           console.log(err)
  //           res.json({message: err})
  //         })
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       res.json({message: err})
  //     })
  // }
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
