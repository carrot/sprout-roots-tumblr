path = require 'path'
fs = require 'fs'

exports.configure = [
  {
    name: 'theme'
    type: 'list'
    message: 'Pick a theme'
    choices: -> fs.readdirSync(path.join(__dirname, 'themes'))
  }
]

exports.beforeRender = (utils, config) ->
  target = path.join('views', 'index.jade')
  utils.src.copy("themes/#{config.theme}/index.jade", target)
