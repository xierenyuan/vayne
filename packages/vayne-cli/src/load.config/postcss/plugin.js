const is = require('../../utils/is')
const log = require('../../utils/log')
const vayneRequire = require('./vayne.require')

class LoadPlugin {
  constructor(config, path) {
    this.config = config
    this.path = path
    this.plugins = []
  }

  require(plugin, options) {
    return vayneRequire(plugin, this.path, options)
  }

  /**
   *
   * 获取到插件
   * @returns {Array} plugins PostCSS Plugin
   * @memberof LoadPlugin
   */
  getPlugin() {
    if (is.isArray(this.config.plugins)) {
      return this.loadOrdinary()
    }
    return this.loadRequire()
  }

  /**
   *
   * 加载node 包模块
   * @returns {Array} plugins PostCSS Plugin
   * @memberof LoadPlugin
   */
  loadRequire() {
    let config = this.config.plugins
    Object.keys(config)
      .filter(function (plugin) {
        return config[plugin] !== false ? plugin : ''
      })
      .forEach((plugin, i) => {
        plugin = this.require(plugin, config[plugin])
        if (plugin.postcss) plugin = plugin.postcss

        if (plugin.default) plugin = plugin.default

        this.error(plugin, i)

        return this.plugins.push(plugin)
      })
    return this.plugins
  }

  /**
   *
   * 加载普通非require 模块
   * @returns {Array} plugins PostCSS Plugin
   * @memberof LoadPlugin
   */
  loadOrdinary() {
    this.plugins = this.config.plugins.filter(Boolean)
    if (this.plugins.length && this.plugins.length > 0) {
      this.plugins.forEach((plugin, i) => {
        if (!plugin) log.fatal('Loading PostCSS Plugin failed')

        if (plugin.postcss) plugin = plugin.postcss

        if (plugin.default) plugin = plugin.default

        this.error(plugin, i)
      })
    }
    return this.plugins
  }

  /**
   *
   * 加载出错 错误处理
   * @param {any} plugin 插件
   * @param {any} module 模块
   * @memberof LoadPlugin
   */
  error(plugin, module) {
    if (!((is.isObject(plugin) && is.isArray(plugin.plugins)) || is.isFunction(plugin))) {
      log.fatal(`Invalid PostCSS Plugin found: [ ${module} ]`)
    }
  }

}

module.exports = LoadPlugin
