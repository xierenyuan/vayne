const {union, assign} = require('lodash')
const path = require('../utils/path')()
const Loader = require('./loaders')
/**
 * 通用webpack conf
 * @param {*} options 传入的 vayne 配置参数
 */
module.exports = config => {
  const include = union([
    path.resolveApp('src'),
    path.resolveApp('test'),
    path.resolveApp('node_modules/@rrc')
  ], config.include || [])
  config.include = include

  const entry = config.entry || {
    app: './src/index.js'
  }
  const output = config.output || {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  }
  // 扩展
  const extensions = config.extensions || []
  // 全局变量配置
  const alias = assign({
    'vue$': 'vue/dist/vue.esm.js',
    'assets': path.resolveApp('src/assets'),
    '@': path.resolveApp('src'),
    '*': path.appDirectory
  }, config.alias || {})
  return {
    context: config.context || path.appDirectory,
    entry: entry,
    output: output,
    resolve: {
      extensions: ['.js', '.vue', '.json', ...extensions],
      alias: alias,
      modules: [
        path.appNodeModules,
        'node_modules',
        path.ownNodeModules
      ]
    },
    // loader 加载器 使用 vayne 本身的loader 和 应用程序的
    resolveLoader: {
      modules: [
        path.appNodeModules,
        path.ownNodeModules
      ]
    },
    // 全局的三方包 loadWebpack.loaders
    externals: config.externals || {},
    module: {
      rules: new Loader(config)
    },
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
}
