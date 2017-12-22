const _ = require('lodash')
const StyleLintPlugin = require('stylelint-webpack-plugin')

// 默认配置
const defaultOptions = {
  files: ['scss/**/*.scss', 'src/**/*.vue', 'src/**/*.scss'],
  customSyntax: 'postcss-html',
  syntax: 'scss'
}

/**
 * vayne stylelint 插件
 * @class VaynePluginStyleLint
 */
class VaynePluginStyleLint {
  constructor({extendWebpack, options, log}) {
    log.success('> Using vayne-plugin-stylelint 插件')
    this.name = 'VaynePluginStyleLint'
    this.extendWebpack = extendWebpack
    this.log = log
    this.init(options)
  }

  init(config) {
    let styleLint = config.styleLint || {}
    let opts = _.assign({}, defaultOptions, styleLint)
    if (styleLint.files) {
      opts.files = _.union(defaultOptions.files, styleLint.files)
    }
    // 注入配置
    this.extendWebpack(webpackConfig => {
      webpackConfig.plugins.push(new StyleLintPlugin(opts))
    })
  }
}

module.exports = VaynePluginStyleLint
