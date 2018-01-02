const config = require('cosmiconfig')
const merge = require('webpack-merge')
const LoadTripartiteConfig = require('./load.tripartite.config')
const log = require('../utils/log')
const DEFAULT_CONFIG = require('./vayne.config')

/**
 *
 * 加载vayne 配置 并和默认配置 merge 得到新的配置
 * @class LoadConfig
 */
class LoadConfig {
  /**
   * Creates an instance of LoadConfig.
   * @param {any} cli options config Options
   * @memberof LoadConfig
   */
  constructor(options) {
    this.ctx = options
    this.file = ''
    this.loadTripartiteConfig = new LoadTripartiteConfig(options)
  }

  /**
   *
   * 使用配置
   * @returns Promise 默认配置和 读取到的配置的集合
   * @memberof LoadConfig
   */
  async useConfig() {
    let {config, file} = await this.loadConfig()
    let nConfig = merge(DEFAULT_CONFIG, config)
    nConfig.cwdConfigFile = file
    if (file) {
      log.success(`> Using extenal vayne configuration location: ${file}`)
    }
    // postcss 不允许覆盖 如果默认发现是postcss 的配置 则给一个警告
    if (nConfig.$postcss) {
      log.warn(`$postcss 在vayne 中是保留关键词 变量不允许使用。你的这个配置是失效的。`)
    }
    // TODO 因为vue-loader 默认以加载了 postcss-load-config 插件 所以 此功能占时禁用
    // nConfig.$postcss = await this.postcss()
    // if (nConfig.$postcss.file) {
    //   log.success(`> Using extenal postcss configuration location: ${nConfig.$postcss.file}`)
    // }
    return nConfig
  }

  /**
   *
   * 加载配置
   * @returns Promise 读文件读取到的配置
   * @memberof LoadConfig
   */
  loadConfig() {
    let options = {rcExtensions: true}
    let path = process.cwd()
    log.debug('加载配置地址:', path)
    return config('vayne', options)
      .load(path)
      .then(result => {
        if (!result) {
          log.warn(`No Vayne Config found in ${path}`)
        }
        this.file = result ? result.filepath : ''
        return result ? result.config : {}
      })
      .then(config => {
        if (typeof config === 'function') {
          config = config(this.ctx)
        } else {
          config = merge(config, this.ctx)
        }

        return {
          config,
          file: this.file
        }
      })
  }

  postcss() {
    return this.loadTripartiteConfig.loadPostcss()
  }
}

module.exports = LoadConfig
