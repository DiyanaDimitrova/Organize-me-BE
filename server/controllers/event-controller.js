let Event = require('mongoose').model('Event')
let mongoose = require('mongoose')
let Schema = mongoose.Schema
// mongoose.connect('mongodb://didi:didi@ds113841.mlab.com:13841/organize-me')
let conn = mongoose.connection
let Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo
let gfs = Grid(conn.db)

module.exports = {
  create: (req, res) => {
    console.log(req.user)
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
    console.log(newEvent)
    writeStream.on('close', (file) => {
      newEvent.fileId = file._id
      console.log(file._id)
      Event.create(newEvent)
          .then(event => {
            console.log(JSON.stringify(event))
            res.json({message: 'OK'})
          })
          .catch(err => {
            console.log(JSON.stringify(err))
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
    console.log(req.user)
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
      console.log(file._id)
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
  view: (req, res) => {
    Event
      .findById(req.params.id)
      .then(event => {
        gfs.files.findOne({
          _id: event.fileId
        }, (err, file) => {
          if (err) {
            console.log(err)
            res.json({message: err})
          }
          res.writeHead(200, {
            'Content-Type': file.contentType
          })
          var readstream = gfs.createReadStream({
            _id: event.fileId
          })
          readstream.on('data', (data) => {
            res.json({event: event, image: data})
          })
          readstream.on('end', () => {
            res.end()
          })
          readstream.on('error', (err) => {
            console.log('An error occurred!', err)
            res.json({message: err})
            throw err
          })
        })
      })
      .catch((err) => {
        console.log(err)
        res.json({message: err})
      })
  }
}
