rimraf = require 'rimraf'
path   = require 'path'
fs     = require 'fs'

test_template_path = path.resolve(_path, '../../')
test_path          = path.join(__dirname, 'tmp')
tpl = 'test-sprout-roots-tumblr'
opts =
  config: path.join(_path, 'locals.json')

before ->
  sprout.add(tpl, test_template_path)
  .then -> rimraf.sync(test_path)
  .then -> sprout.init(tpl, test_path, opts)

after ->
  # sprout.remove(tpl)
  # .then -> rimraf.sync(test_path)

describe 'init', ->
  it 'creates new project from template', (done) ->
    tgt = path.join(test_path, 'views', 'index.jade')
    fs.existsSync(tgt).should.be.ok
    done()
