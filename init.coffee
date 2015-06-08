Promise = require 'bluebird'
path    = require 'path'
ncp     = Promise.promisify(require('ncp').ncp)
fs      = require 'fs'

exports.configure = [
  {
    name: 'theme'
    type: 'list'
    message: 'Pick a theme'
    choices: -> fs.readdirSync(path.join(__dirname, 'themes'))
  }
]

exports.after = (utils, config) ->
  tgt = path.join(utils._src, 'themes', config.theme)
  ncp(tgt, utils._target)
