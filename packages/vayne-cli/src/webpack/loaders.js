const {union} = require('lodash')
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
    this.useVue()
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

  useVue() {
    this.rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: this.vueLoaderConf(this.config, this.utils)
    })
  }

  useJs() {
    const plugins = this.config.plugins || []
    // js 因为angular.js 会引入babel 所以 判断插件如果是angularjs 则移除 babel
    let isAngularPlugin = plugins.findIndex(item => {
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
        include: union(this.include, [ path.ownDir('node_modules/webpack-dev-server/client') ])
      })
    }
  }

  /**
   *
   * vue loader 配置
   * @param {any} config vayne 全局配置
   * @param {any} utils vayne 工具库
   * @returns 返回vue loader 配置
   */
  vueLoaderConf(config, utils) {
    const isProduction = utils.isProduction()
    const sourceMapEnabled = isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap
    let vue = config.vue || {}
    // postcss 插件会重复编译 导致 自己写的rem 插件会失效 所以提供出去 某些情况下禁用掉
    let usePostCSS = vue.usePostCSS === undefined ? true : vue.usePostCSS
    let cssLoader = utils.cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: isProduction,
      usePostCSS: usePostCSS
    })

    // TODO 解决 解构... 无法使用的问题 可能是因为vue-loader  和babel-loader  没有在一起 先这样写吧..
    let loaders = Object.assign(
      {},
      cssLoader,
      {js: 'babel-loader'})

    let options = {
      loaders: loaders,
      cssSourceMap: sourceMapEnabled,
      cssModules: {
        localIdentName: '[name]__[local]___[hash:base64:5]',
        camelCase: true
      },
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    }
    // 加载postcss 配置
    if (usePostCSS) {
      options.postcss = config.postcss
    }
    return options
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
