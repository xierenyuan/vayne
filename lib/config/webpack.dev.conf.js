'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = (args, config, paths) => {
  const utils = require('./utils')(config, paths)
  const baseWebpackConfig = require('./webpack.base.conf')(args, config, paths, utils)
  // default port where dev server listens for incoming traffic
  const PORT = args.port || config.dev.port || 8000
  const HOST = args.host || config.dev.host

  // automatically open browser, if not set will be false
  const autoOpenBrowser = args.openBrowser || !!config.dev.autoOpenBrowser

  const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in .vaynerc.js
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: true,
      // contentBase: paths.appPublic,
      hot: true,
      host: HOST,
      port: PORT,
      open: autoOpenBrowser,
      overlay: config.dev.errorOverlay ? {
        warnings: false,
        errors: true
      } : false,
      publicPath: config.dev.assetsPublicPath,
      proxy: config.dev.proxyTable,
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
        ignored: /node_modules/,
        poll: config.dev.poll
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': config.dev.env
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${PORT}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      })
    ]
  })
  return devWebpackConfig
}
