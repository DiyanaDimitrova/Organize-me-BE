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
    let newEvent = {
      title: req.body.title,
      date: req.body.dateValue,
      time: req.body.hourValue,
      place: req.body.place
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
  }
}
