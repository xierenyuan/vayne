const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const webpack = require('webpack')
const log = require('./utils/log')
const Vayne = require('../')
module.exports = async (cmd, command) => {
  const vayne = new Vayne(cmd, command)
  let {webpackConfig, config} = await vayne.build()
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
}
