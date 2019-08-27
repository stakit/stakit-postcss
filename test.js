var tape = require('tape')
var tapePromise = require('tape-promise').default
var stakit = require('stakit')
var testWriter = require('stakit-test-writer')
var fs = require('fs')
var postcss = require('.')

var test = tapePromise(tape)

test('arguments are checked', function (t) {
  t.plan(2)

  t.throws(postcss, 'throws without arguments')
  t.throws(postcss.bind(null, 5), 'throws if entry is not string')
})

test('it works', async function (t) {
  t.plan(2)

  var cssPath = './example/style.css'

  var writer = testWriter()
  var cssRaw = fs.readFileSync(cssPath, 'utf8')

  await stakit()
    .use(postcss(cssPath))
    .routes(() => ['/'])
    .render(render)
    .output(writer)

  t.ok(writer.get('/bundles/bundle.css') === cssRaw, 'css files are equal')

  var html = writer.get('/index.html')
  t.ok(html.includes('<link rel="stylesheet" href="/bundles/bundle.css">'), 'link tag was appended')
})

test('opts.includeStyle', async function (t) {
  t.plan(1)

  var writer = testWriter()

  await stakit()
    .use(postcss('./example/style.css', { includeStyle: false }))
    .routes(() => ['/'])
    .render(render)
    .output(writer)

  var html = writer.get('/index.html')
  t.ok(!html.includes('<link rel="stylesheet" href="/bundles/bundle.css">'), 'link tag was appended')
})

test('opts.output', async function (t) {
  t.plan(2)

  var output = '/style.css'
  var writer = testWriter()

  await stakit()
    .use(postcss('./example/style.css', { output: output }))
    .routes(() => ['/'])
    .render(render)
    .output(writer)

  t.ok(writer.get('/bundles/bundle.css') === undefined, '/bundles/bundle.css is empty')
  t.ok(typeof writer.get(output) === 'string', '/style.css is full of css')
})

function render (route, state) {
  return `<body>${route}</body>`
}
