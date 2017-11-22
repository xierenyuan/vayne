'use strict'

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}
const argv = require('yargs') // eslint-disable-line
.usage('Usage: vayne server [options]')
.option('R', {
  alias: 'report',
  describe: 'View the bundle analyzer report after build finishes',
  type: 'boolean',
  default: false
})
.help('h')
.argv

process.env.VAYNE_BUILD_ARGV = JSON.stringify(argv)

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const webpack = require('webpack')
const cwd = process.cwd()
const config = require('../utils/config')(process.env.NODE_ENV, cwd)
// const paths = require('../utils/path')(cwd)
const webpackConfig = require('./webpack.prod.conf')
const log = require('../log')
console.log(JSON.stringify(webpackConfig))

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      log.error('  Build failed with errors.\n')
      process.exit(1)
    }

    log.success('  Build complete.\n')
    log.warn(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    )
  })
})
