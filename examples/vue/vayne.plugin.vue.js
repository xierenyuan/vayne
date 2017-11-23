/**
 *
 * vayne vue 插件
 * @param {any} config vayne 配置
 * @param {any} log  vayne log
 * @param {any} utils vayne 工具库
 * @returns webpack vue loader
 */
module.exports = function(config, log, utils) {
  log.debug('开始解析 vayne vue插件')
  return {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConf(config, utils)
      }
    ]
  }
}

/**
 *
 * vue loader 配置
 * @param {any} config vayne 全局配置
 * @param {any} utils vayne 工具库
 * @returns 返回vue loader 配置
 */
function vueLoaderConf(config, utils) {
  const isProduction = utils.isProduction()
  const sourceMapEnabled = isProduction
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap
  return {
    loaders: utils.cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: isProduction
    }),
    cssSourceMap: sourceMapEnabled,
    transformToRequire: {
      video: 'src',
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    }
  }
}
