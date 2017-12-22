const {join} = require('path')
const ware = require('ware')
const Base = require('./base')
const is = require('./utils/is')
const CreateWebpackConfig = require('./webpack')
class Plugin extends Base {
  constructor(cmd, options) {
    super(cmd, options)
    // 中间件存储地址  对呀插件
    this.middlewares = []
    // webpack 生命周期数 参考 poi 实现
    this.webpackFlows = []

    // 工具
    this.utils = require('./utils/utils')(options)
  }

  require(name) {
    // 处理没有带前缀的 插件 考虑到 现在的发到 vayne 子作用域下使用 所以对带 @vayne 的不加前缀
    if (name.indexOf('vayne-plugin') === -1 && name.indexOf('@vayne') === -1) {
      name = `vayne-plugin-${name}`
    }
    let plugin = null
    try {
      let fileName = join(process.cwd(), `node_modules/${name}`)
      this.log.debug(`加载插件 ${name} 地址是${fileName}`)
      plugin = require(fileName)
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND' && error.message.indexOf(name) !== -1) {
        this.log.error(`Cannot find plugin ${name}. Did you forget to install it?\n npm install ${name} --save-dev \n or yarn add ${name} -D`)
        this.log.fatal('Loading plugin error')
      } else {
        this.log.fatal(`Loading ${name} plugin error: ` + error)
      }
    }
    return plugin
  }

  requirePlugin(plugin) {
    if (is.isFunction(plugin)) {
      return plugin
    }
    if (is.isString(plugin)) {
      return this.require(plugin)
    }
  }

  /**
   *
   * 加载插件
   * @param {any} config vayne 配置
   * @memberof Plugin
   */
  usePlugin(config) {
    let plugins = config.plugins || []
    const content = {
      extendWebpack: this.addWebpackFlow.bind(this),
      on: this.on.bind(this),
      once: this.once.bind(this),
      options: config,
      log: this.log,
      run: this.addMiddleware.bind(this),
      utils: this.utils,
      isEnv: this.isEnv.bind(this)
    }

    plugins
      .map((plugin) => {
        return this.requirePlugin(plugin)
      })
      .forEach(plugin => new plugin(content)) // eslint-disable-line
  }

  addWebpackFlow(env, fn) {
    if (is.isFunction(env)) {
      this.webpackFlows.push(env)
    } else if (this.isEnv(env)) {
      this.webpackFlows.push(fn)
    }
    return this
  }

  /**
   *
   * 引入中间件机制 来处理一些 需要在最开始加入到工作流的事情
   * @param {any} env
   * @param {any} fn
   * @returns
   * @memberof Plugin
   */
  addMiddleware(env, fn) {
    this.log.info('addMiddleware')
    if (is.isFunction(env)) {
      this.middlewares.push(env)
    } else if (this.isEnv(env)) {
      this.middlewares.push(fn)
    }
    return this
  }

  createConfig(config) {
    if (this.webpackConfig) {
      return this.webpackConfig
    }
    // 加载插件
    this.usePlugin(config)
    let createWebpack = new CreateWebpackConfig(config)
    this.webpackConfig = createWebpack[config.name]()
    // 初始化插件的webpack 配置
    this.webpackFlows.forEach(flow => flow(this.webpackConfig))
    return this.webpackConfig
  }

  /**
   *
   * 启动中间件
   * @param {any} config vayne 配置
   * @returns {Promise} 重组后的webpack 配置
   * @see https://www.npmjs.com/package/ware
   * @memberof Plugin
   */
  runMiddlewares(config) {
    return new Promise((resolve, reject) => {
      let webpackConfig = this.createConfig(config)
      ware()
        .use(this.middlewares)
        .run(webpackConfig, err => {
          if (err) return reject(err)
          resolve(webpackConfig)
        })
    })
  }
}

module.exports = Plugin
