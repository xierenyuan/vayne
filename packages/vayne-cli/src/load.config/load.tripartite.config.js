const postcssLoadConfig = require('./postcss/index')

/**
 *
 * 加载三方组件 来自于poi-load-config
 * @class LoadTripartiteConfig
 */
class LoadTripartiteConfig {
  constructor(options) {
    this.options = options
  }

  /**
   *
   * 加载postcss 参数
   * @returns Promise
   * @memberof LoadTripartiteConfig
   */
  loadPostcss() {
    const handleError = err => {
      if (err.message.indexOf('No PostCSS Config found') === -1) {
        throw err
      }
      // Return empty options for PostCSS
      return {}
    }
    return postcssLoadConfig({}, this.options.cwd, { argv: false })
      .catch(handleError)
  }
}
module.exports = LoadTripartiteConfig
