var stakit = require('stakit')
var path = require('path')
var postcss = require('..')

stakit()
  .use(postcss(path.join(__dirname, './style.css')))
  .routes(() => ['/'])
  .render(render)
  .output()

function render (route, state) {
  return `<body>${route}</body>`
}
