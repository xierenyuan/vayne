const config = require('cosmiconfig')
const merge = require('webpack-merge')
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
          log.fatal(`No Vayne Config found in ${path}`)
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
}

module.exports = LoadConfig
