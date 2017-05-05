let Event = require('mongoose').model('Event')
let mongoose = require('mongoose')
let Schema = mongoose.Schema
// mongoose.connect('mongodb://didi:didi@ds113841.mlab.com:13841/organize-me')
let conn = mongoose.connection
let Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo
let gfs = Grid(conn.db)
// var ObjectID = mongoose.mongo.BSONPure.ObjectID

module.exports = {
  create: (req, res) => {
    let newEvent = {
      title: req.body.title,
      date: req.body.dateValue,
      time: req.body.hourValue,
      place: req.body.place,
      capacity: req.body.capacity,
      details: req.body.details,
      categoryId: req.body.categoryId
      // creatorId: req.user.username
    }
    let filename = req.body.file
    let type = req.body.type
    var writeStream = gfs.createWriteStream({
      filename: filename,
      mode: 'w',
      content_type: type
    })
    writeStream.on('close', (file) => {
      newEvent.fileId = file._id
      Event.create(newEvent)
          .then(event => {
            res.json({message: 'OK'})
          })
          .catch(err => {
            console.log(err)
            res.json({message: err})
          })
    })
    writeStream.write(req.body.imagePreviewUrl)
    writeStream.end()
  },
  getAll: (req, res) => {
    Event
      .find()
      .then(events => {
        res.json({events: events})
      })
      .catch(err => {
        console.log(err)
      })
  },
  update: (req, res) => {
    let title = req.body.title
    let date = req.body.dateValue
    let time = req.body.hourValue
    let place = req.body.place
    let capacity = req.body.capacity
    let details = req.body.details
    let categoryId = req.body.categoryId
    let filename = req.body.file
    let type = req.body.type
    var writeStream = gfs.createWriteStream({
      filename: filename,
      mode: 'w',
      content_type: type
    })
    writeStream.on('close', (file) => {
      let fileId = file._id
      Event
        .findByIdAndUpdate(req.params.id, {
          $set: {
            title: title,
            date: date,
            time: time,
            place: place,
            fileId: fileId,
            categoryId: categoryId,
            capacity: capacity,
            details: details
          }
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
    writeStream.write(req.body.imagePreviewUrl)
    writeStream.end()
  },
  delete: (req, res) => {
    Event
     .findByIdAndRemove(req.params.id)
     .then(() => {
       res.json({message: 'OK'})
     })
     .catch((err) => {
       console.log(err)
       res.json({message: err})
     })
  },
  getImage: (req, res) => {
    let eventId = mongoose.Types.ObjectId(req.params.id)

    Event
      .findOne({
        _id: eventId
      }, (err, event) => {
        if (err) {
          console.log(err)
          res.json({message: err})
        }
        gfs.files.findOne({
          _id: mongoose.Types.ObjectId(event.fileId)
        }, (err, file) => {
          if (err) {
            console.log(err)
          }
          res.writeHead(200, {
            'Content-Type': file.contentType
          })
          let readStream = gfs.createReadStream({
            _id: event.fileId
          })
          readStream.pipe(res)
          // readstream.on('data', (data) => {
          //   res.write(data)
          // })
          // readstream.on('end', () => {
          //   res.end()
          // })
          // readstream.on('error', (err) => {
          //   console.log('An error occurred!', err)
          //   throw err
          // })
        })
      })
  },
  view: (req, res) => {
    Event
     .findById(req.params.id)
     .then((event) => {
       res.json({event: event})
     })
     .catch((err) => {
       console.log(err)
       res.json({message: err})
     })
  },
  attendEvent: (req, res) => {
    // let attend = null
    // if (req.body.type === 'going') {
    //   attend = { goingPeople: req.body.username }
    // } else if (req.body.type === 'interested') {
    //   attend = { interestedPeople: req.body.username }
    // } else if (req.body.type === 'notGoing') {
    //   attend = { notGoingPeople: req.body.username }
    // }
    Event
      .findByIdAndUpdate(req.params.id, {
        $push: {invitedPeople: req.body}
      })
      .exec()
      .then(() => {
        res.json({message: 'OK'})
      })
      .catch((err) => {
        console.log(err)
        res.json({message: err})
      })
  }
}
