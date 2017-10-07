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
  console.log('HW' + hw)
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
    console.log('REQ Body' + JSON.stringify(req.body))
    Event
     .findById(req.body.eventId)
     .then((event) => {
       User
       .find({ username: { $in: req.body.usersToSendCode } })
       .then((users) => {
         console.log('USER' +  JSON.stringify(users))
         users.forEach(user => {
           let cryptedString = createCryptedObj(req, user)
           Code
           .create({
             code: cryptedString,
             isUsed: false,
             user: user._id,
             event: event._id
           })
           .then(code => {
             console.log(code)
           })
           .catch(err => {
             console.log(err)
             res.json({message: err})
           })
           email.sendTicket(cryptedString, user, event)
           res.json({message: 'OK'})
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
  },
  scanCode: (req, res) => {
    console.log(JSON.stringify(req.body))
    Code
    .findOneAndUpdate({code: req.body.scanedCode}, {$set: {isUsed: true}})
    .then((code) => {
      console.log('CODE' + JSON.stringify(code))
      User
      .findById(code.user)
      .then((user) => {
        Event
        .findById(code.event)
        .then((event) => {
          console.log('EVENT' + JSON.stringify(event))
          res.json({message: "GUEST: " + user.firstName + " " + user.lastName + " EVENT: " + event.title})
        })
        .catch((err) => {
          console.log(err)
          res.json({message: 'Ticket is not valid' })
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
