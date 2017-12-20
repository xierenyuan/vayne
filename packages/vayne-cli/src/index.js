const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
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

  /**
   *
   * 处理 端口号占用
   * @param {any} webpackConfig webpack config
   * @param {any} config vayne config
   * @returns new webpackConfig
   * @memberof Vayne
   */
  protHander(webpackConfig, config) {
    return new Promise((resolve, reject) => {
      portfinder.basePort = config.port
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err)
        } else {
          // publish the new Port, necessary for e2e tests
          process.env.PORT = port
          // add port to devServer config
          webpackConfig.devServer.port = port

          // Add FriendlyErrorsPlugin
          webpackConfig.plugins.push(new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
              messages: [this.log.log('success', `Your application is running here: http://${webpackConfig.devServer.host}:${port}`)]
            },
            onErrors: config.dev.notifyOnErrors
              ? this.utils.createNotifierCallback()
              : undefined
          }))
          resolve(webpackConfig)
        }
      })
    })
  }

  dev() {
    return new Promise(async (resolve, reject) => {
      try {
        let config = await this.prepare()
        // 处理默认配置
        config.port = config.port || config.dev.port
        config.host = config.host || config.dev.host
        // 工具库
        this.utils = require('./utils/utils')(config)
        let webpackConfig = await this.plugin.runMiddlewares(config)
          .then(webpackConfig => {
            return this.protHander(webpackConfig, config)
          })
        resolve(webpackConfig)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  build() {
    return new Promise(async (resolve, reject) => {
      try {
        let config = await this.prepare()
        let webpackConfig = await this.plugin.runMiddlewares(config)
        // 因为build 需要使用配置 所以多返回一个配置
        resolve({
          webpackConfig: webpackConfig,
          config: config
        })
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
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
