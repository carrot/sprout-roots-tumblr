axis         = require 'axis'
rupture      = require 'rupture'
autoprefixer = require 'autoprefixer-stylus'
inlineCss    = require 'roots-inline-css'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf']

  extensions: [inlineCss()]

  stylus:
    use: [axis(), rupture(), autoprefixer()]

  'coffee-script':

  jade:
    pretty: true
