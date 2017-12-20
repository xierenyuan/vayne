
class VaynePluginVue {
  constructor({extendWebpack, options, log, utils}) {
    log.debug('开始解析 vayne vue插件')
    this.name = 'VaynePluginVue'
    this.extendWebpack = extendWebpack
    this.log = log
    this.init(options, utils)
  }

  init(config, utils) {
    // 注入配置
    this.extendWebpack(webpackConfig => {
      webpackConfig.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-loader',
        options: this.vueLoaderConf(config, utils)
      })
    })
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

    return {
      loaders: loaders,
      cssSourceMap: sourceMapEnabled,
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    }
  }
}

module.exports = VaynePluginVue
