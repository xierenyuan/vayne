
const merge = require('webpack-merge')

/**
 *
 * 创建基础webpack 配置
 * @class CreateWebpackConfig
 */
class CreateWebpackConfig {
  constructor(options) {
    this.options = options

    this.utils = require('../utils/utils')(options)
    this.baseWebpackConfig = require('./webpack.base.conf')(options)
  }

  serve() {
    const devConfig = require('./webpack.dev.conf')(this.options, this.utils)
    return merge(this.baseWebpackConfig, devConfig)
  }

  build() {
    const buildConfig = require('./webpack.dev.conf')(this.options, this.utils)
    return merge(this.baseWebpackConfig, buildConfig)
  }
}

module.exports = CreateWebpackConfig
