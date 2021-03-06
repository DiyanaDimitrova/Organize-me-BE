const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://didi:didi@ds113841.mlab.com:13841/organize-me',
    port: 3001
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://didi:didi@ds113841.mlab.com:13841/organize-me',
    port: process.env.PORT
  }
}
