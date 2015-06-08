axis         = require 'axis'
rupture      = require 'rupture'
autoprefixer = require 'autoprefixer-stylus'
tumblr       = require 'roots-tumblr'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf']

  extensions: [tumblr()]

  stylus:
    use: [axis(), rupture(), autoprefixer()]
    sourcemap: true

  jade:
    pretty: true
