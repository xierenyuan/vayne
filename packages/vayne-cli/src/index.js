const Path = require('path')
const Base = require('./base')
const LoadConfig = require('./load.config')
const Plugin = require('./plugin')

// TODO 包入口文件 使用 vinyl-fs 来获取
class Vayne extends Base {
  constructor(cmd, options) {
    super(cmd, options)
    // 如果有输入 之后可以输入一个文件 配置
    this.mainFile = Path.resolve(cmd || '')
    this.plugin = new Plugin(cmd, options)
  }

  async start() {
    this.plugin.addMiddleware('development', webpackConfig => {
      webpackConfig.$$development = true
      // console.log('啦啦啦...', webpackConfig)
    })
    let config = await this.prepare()
      .then(config => this.plugin.runMiddlewares(config))
      .then(webpackConfig => {
        return webpackConfig
      })
      .catch(console.log)

    console.log('last config ---------', config.module)
  }

  /**
   *
   * 准备启动读取到 vayne 配置
   * @memberof Vayne
   */
  prepare() {
    let loadConfig = new LoadConfig(this.options)
    return loadConfig.useConfig()
  }

}

module.exports = Vayne
