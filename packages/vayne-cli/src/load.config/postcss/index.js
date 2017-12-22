const {resolve} = require('path')
const config = require('cosmiconfig')
const {assign} = require('lodash')
const loadOptions = require('postcss-load-options/lib/options.js')
const LoadPlugin = require('./plugin')

module.exports = function postcssrc(ctx, path, options) {
  ctx = assign({ cwd: process.cwd(), env: process.env.NODE_ENV }, ctx)

  path = path ? resolve(path) : process.cwd()

  options = assign({ rcExtensions: true }, options)

  if (!ctx.env) process.env.NODE_ENV = 'development'

  let file

  return config('postcss', options)
    .load(path)
    .then(function (result) {
      if (!result) throw Error('No PostCSS Config found in: ' + path)

      file = result ? result.filepath : ''

      return result ? result.config : {}
    })
    .then(function (config) {
      if (typeof config === 'function') config = config(ctx)
      else config = assign(config, ctx)

      if (!config.plugins) config.plugins = []

      return {
        plugins: new LoadPlugin(config, path).getPlugin(),
        options: loadOptions(config),
        file: file
      }
    })
}
