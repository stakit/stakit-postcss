var assert = require('assert')
var postcss = require('postcss')
var fs = require('fs')
var path = require('path')
var { Readable } = require('stream')
var { includeStyle } = require('stakit/transforms')

module.exports = function (entry, opts, postcssOpts) {
  assert(typeof entry === 'string', 'stakit-postcss: entry must be a string')

  entry = resolve(entry)

  opts = Object.assign({
    plugins: [],
    includeStyle: true,
    output: '/bundles/bundle.css'
  }, opts)

  postcssOpts = postcssOpts || {}
  Object.assign(postcssOpts, {
    from: entry
  })

  var stream = new Readable()
  stream._read = Function.prototype

  var rawCss = fs.readFileSync(entry, 'utf8')

  postcss(opts.plugins)
    .process(rawCss, postcssOpts)
    .then(function (result) {
      stream.push(result.css)
      stream.push(null)
    })

  // return stakit plugin
  return function (ctx) {
    // add file to the files list
    ctx._files.push({
      destination: opts.output,
      stream: stream
    })

    // automatically include it if needed
    if (opts.includeStyle) {
      ctx._transforms.push({
        fn: includeStyle,
        opts: opts.output
      })
    }
  }
}

function resolve (str) {
  return path.isAbsolute(str) ? str : path.resolve(str)
}
