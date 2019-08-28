var test = require('tape')
var stakit = require('stakit')
var testWriter = require('stakit-test-writer')
var fs = require('fs')
var postcss = require('.')

test('arguments are checked', function (t) {
  t.plan(2)

  t.throws(postcss, 'throws without arguments')
  t.throws(postcss.bind(null, 5), 'throws if entry is not string')
})

test('it works', function (t) {
  t.plan(2)

  var cssPath = './example/style.css'

  var writer = testWriter()
  var cssRaw = fs.readFileSync(cssPath, 'utf8')

  var kit = stakit()
    .use(postcss(cssPath))
    .routes(() => ['/'])
    .render(render)

  kit.output(writer).then(function () {
    t.ok(writer.get('/bundles/bundle.css') === cssRaw, 'css files are equal')

    var html = writer.get('/index.html')
    t.ok(html.includes('<link rel="stylesheet" href="/bundles/bundle.css">'), 'link tag was appended')
  })
})

test('opts.includeStyle', function (t) {
  t.plan(1)

  var writer = testWriter()

  var kit = stakit()
    .use(postcss('./example/style.css', { includeStyle: false }))
    .routes(() => ['/'])
    .render(render)

  kit.output(writer).then(function () {
    var html = writer.get('/index.html')
    t.ok(!html.includes('<link rel="stylesheet" href="/bundles/bundle.css">'), 'link tag was appended')
  })
})

test('opts.output', function (t) {
  t.plan(2)

  var output = '/style.css'
  var writer = testWriter()

  var kit = stakit()
    .use(postcss('./example/style.css', { output: output }))
    .routes(() => ['/'])
    .render(render)

  kit.output(writer).then(function () {
    t.ok(writer.get('/bundles/bundle.css') === undefined, '/bundles/bundle.css is empty')
    t.ok(typeof writer.get(output) === 'string', '/style.css is full of css')
  })
})

function render (route, state) {
  return `<body>${route}</body>`
}
