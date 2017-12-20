const {EventEmitter} = require('events')
const log = require('./utils/log')

/**
 *
 * 通用运行基类 提供一些常用的方法和扩展
 * @class Base
 */
class Base extends EventEmitter {
  constructor(cmd, options) {
    super()
    this.log = log
    this.init(options)
  }

  init(options) {
    this.options = this.initOptions(options)
  }

  /**
   *
   * 判断当前的运行环境 是否符合传入的 判断依据是 NODE_ENV 单元测试之后要扩展。 如果之后只支持 moka 的话换 命令name 来区分
   * @param {any} env 传入的运行环境
   * @returns {Boolbean} 如果是当前运行环境为 true
   * @memberof Base
   */
  isEnv(env) {
    let currentEnv = this.options.env
    const isEnv = typeof env === 'string' && env === currentEnv
    const hasEnv = Array.isArray(env) && env.indexOf(currentEnv) > -1
    return isEnv || hasEnv
  }

  /**
   *
   * 初始化cli 基础配置
   * @param {any} options cli 输入
   * @returns 返回输入的配置
   * @memberof Vayne
   */
  initOptions(options) {
    let name = options.name()

    // 初始化全局变量
    if (name === 'build') {
      process.env.NODE_ENV = 'production'
    } else {
      process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    }

    return {
      cwd: process.cwd(),
      env: process.env.NODE_ENV,
      name: name,
      open: options.open || false,
      config: options.config,
      report: options.report || false
    }
  }
}

module.exports = Base
