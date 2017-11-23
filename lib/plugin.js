const log = require('./log')
const _ = require('lodash')
const path = require('path')
/**
 *
 * 引入插件的概念用于加载 不同环境所需的loader 和三方包
 * @param {any} config 读取到的vayne 配置
 * @param {any} utils vayne 工具
 */
module.exports = (config, utils) => {
  let loaders = []
  let webpackPlugins = []
  let plugins = config.plugins || []

  /**
   *
   * 加载插件
   * @param {any} name 插件名称
   */
  function requirePlugin(name) {
    // 处理没有带前缀的 插件
    if (name.indexOf('vayne-plugin') === -1) {
      name = `vayne-plugin-${name}`
    }
    try {
      let fileName = path.join(process.cwd(), `node_modules/${name}`)
      log.debug(`加载插件 ${name} 地址是${fileName}`)
      let plugin = require(fileName)(config, log, utils)
      loaderConfig(plugin)
    } catch (error) {
      console.log(error)
      if (error.code === 'MODULE_NOT_FOUND' && error.message.indexOf(name) !== -1) {
        log.error(`Cannot find plugin ${name}. Did you forget to install it?\n npm install ${name} --save-dev \n or yarn add ${name} -D`)
        log.fatal('Loading plugin error')
      }
    }
  }

  /**
   *
   * 处理插件配置为 webpack 格式
   * @param {any} plugin 插件配置
   */
  function loaderConfig(plugin) {
    // loader 处理
    if (_.isArray(plugin.loaders)) {
      loaders = _.union(loaders, plugin.loaders)
    }
    // plugin 处理
    if (_.isArray(plugin.plugins)) {
      webpackPlugins = _.union(webpackPlugins, plugin.plugins)
    }
  }

  // 循环加载多个插件
  plugins.forEach(plugin => {
    if (_.isString(plugin)) {
      requirePlugin(plugin)
      return
    }
    if (_.isObject(plugin)) {
      loaderConfig(plugin.call(this, config, log, utils))
      return
    }
    log.fatal(`Invalid plugin ${plugin}`)
  })

  return {
    loaders: loaders,
    plugins: webpackPlugins
  }
}
