const _ = require('lodash')
module.exports = (config, paths, utils) => {
  let rules = []
  // 编译
  const include = config.include
  // limit
  const limit = config.urlLoaderLimit || 10000
  const plugins = config.plugins || []
  if (config.dev.useEslint) {
    rules.push({
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: include,
      options: {
        formatter: require('eslint-friendly-formatter'),
        eslintPath: paths.resolveApp('node_modules/eslint'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
      }
    })
  }

  // js 因为angular.js 会引入babel 所以 判断插件如果是angularjs 则移除 babel
  let isAngularPlugin = plugins.findIndex(item => {
    if (_.isString(item)) {
      return item.indexOf('angular')
    }
    if (_.isFunction(item)) {
      return item.name.indexOf('angular')
    }
    return -1
  })
  if (isAngularPlugin === -1) {
    rules.push({
      test: /\.js$/,
      loader: 'babel-loader',
      include: include
    })
  }

  // assets
  rules.push({
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: limit,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
    }
  })

  rules.push({
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: limit,
      name: utils.assetsPath('media/[name].[hash:7].[ext]')
    }
  })

  rules.push({
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
    }
  })

  return rules
}
