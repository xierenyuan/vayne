const is = require('../utils/is')
const path = require('../utils/path')()
class Loader {
  constructor(config) {
    this.config = config
    // 编译
    this.include = config.include
    // limit
    this.limit = config.urlLoaderLimit || 10000
    this.utils = require('../utils/utils')(config)
    this.rules = []
    this.use()
  }

  use() {
    this.useEslint()
    this.useJs()
    this.useAssets()
  }

  useEslint() {
    this.rules.push({
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: this.include,
      options: {
        formatter: require('eslint-friendly-formatter'),
        eslintPath: path.resolveApp('node_modules/eslint'),
        emitWarning: !this.config.dev.showEslintErrorsInOverlay
      }
    })
  }

  useJs() {
    // js 因为angular.js 会引入babel 所以 判断插件如果是angularjs 则移除 babel
    let isAngularPlugin = this.config.plugins.findIndex(item => {
      if (is.isString(item)) {
        return item.indexOf('angular') !== -1
      }
      if (is.isFunction(item)) {
        return item.name.indexOf('angular') !== -1
      }
      return false
    })
    if (isAngularPlugin === -1) {
      this.rules.push({
        test: /\.js$/,
        loader: 'babel-loader',
        include: this.include
      })
    }
  }

  useAssets() {
    this.rules.push({
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: this.limit,
        name: this.utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    })

    this.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: this.limit,
        name: this.utils.assetsPath('media/[name].[hash:7].[ext]')
      }
    })

    this.rules.push({
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: this.limit,
        name: this.utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    })
  }

  getRules() {
    return this.rules
  }
}

module.exports = Loader
