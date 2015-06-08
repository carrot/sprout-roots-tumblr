rimraf = require 'rimraf'
path   = require 'path'
fs     = require 'fs'
Roots  = require 'roots'

test_template_path = path.resolve(_path, '../../')
test_path          = path.join(_path, 'site')
tpl = 'test-sprout-roots-tumblr'
opts =
  config: path.join(_path, 'locals.json')

before (done) ->
  sprout.add(tpl, test_template_path)
  .then -> rimraf.sync(test_path)
  .then -> sprout.init(tpl, test_path, opts)
  .then -> h.project.install_dependencies('*', done)

after ->
  sprout.remove(tpl)

describe 'sprout', ->
  it 'inits the project properly', (done) ->
    if fs.existsSync(path.join(test_path, 'views'))
      tgt = path.join(test_path, 'views/index.jade')

    else
      tgt = path.join(test_path, 'index.jade')

    fs.existsSync(tgt).should.be.ok
    done()

describe 'roots', ->
  before -> h.project.compile(Roots, 'site')

  it 'compiles the roots project, properly', (done) ->
    tgt = path.join(test_path, 'public', 'index.html')
    fs.existsSync(tgt).should.be.ok
    done()
