const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = (config, utils) => {
  return {
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    devtool: config.dev.devtool,
    // these devServer options should be customized in .vaynerc.js
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: true,
      // contentBase: paths.appPublic,
      hot: true,
      host: config.host,
      port: config.port,
      open: config.open,
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
      },
      // fix 如果自定义了域名 提示 无效的 host header https://github.com/webpack/webpack-dev-server/issues/882
      disableHostCheck: true
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
        template: config.template || 'src/index.tpl',
        inject: true
      })
    ]
  }
}
