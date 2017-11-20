'use strict'
module.exports = function(config, utils) {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    loaders: utils.cssLoaders({
      sourceMap: isProduction
        ? config.build.productionSourceMap
        : config.dev.cssSourceMap,
      extract: isProduction
    }),
    transformToRequire: {
      video: 'src',
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    }
  }
}
