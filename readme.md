# stakit-postcss
Stakit + PostCSS

<a href="https://www.npmjs.com/package/stakit-postcss">
  <img src="https://img.shields.io/npm/v/stakit-postcss.svg?style=flat-square" alt="NPM version"/>
</a>


## Installation
```
npm i stakit-postcss
```

## Example

```javascript
var stakit = require('stakit')
var path = require('path')
var postcss = require('stakit-postcss')

stakit()
  .use(postcss(path.join(__dirname, './style.css')))
  .routes(() => ['/'])
  .render(render)
  .output()
```

## API
### `postcss(entry, opts, postcssOpts)`
Returns a Stakit plugin that runs `entry` through PostCSS and includes it in the files outputted by Stakit.

`opts` are `stakit-postcss` specific options (with defaults):
- `opts.plugins: []` - an array of PostCSS plugins
- `opts.includeStyle: true` - whether a `<link>` tag should automatically be included in the `<head>`
- `opts.output: '/bundles/bundle.css'` - output location within the Stakit's output directory

`postcssOpts` are simply forwarded to PostCSS. The `from` value is always set to `entry`.
