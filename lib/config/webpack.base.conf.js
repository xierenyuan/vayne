'use strict'
const _ = require('lodash')
const plugins = require('../plugin')
const loaders = require('./loaders')

module.exports = (args, config, paths, utils) => {
  // 加载过来的webpack 插件
  let loadWebpack = plugins(config, utils)
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
  const alias = _.assign({
    'vue$': 'vue/dist/vue.esm.js',
    'assets': paths.resolveApp('src/assets'),
    '@': paths.resolveApp('src'),
    '*': paths.appDirectory
  }, config.alias || {})
  return {
    context: config.context || paths.appDirectory,
    entry: entry,
    output: output,
    resolve: {
      extensions: ['.js', '.vue', '.json', ...extensions],
      alias: alias,
      modules: [
        paths.appNodeModules,
        'node_modules',
        paths.ownNodeModules
      ]
    },
    // loader 加载器 使用 vayne 本身的loader 和 应用程序的
    resolveLoader: {
      modules: [
        paths.appNodeModules,
        paths.ownNodeModules
      ]
    },
    // 全局的三方包 loadWebpack.loaders
    externals: config.externals || {},
    module: {
      rules: _.union(loaders(config, paths, utils), loadWebpack.loaders)
    },
    // 默认的是放在第一位的 之后看是否有必要 扩展 afterPlugin beforePlugin 因为现在webpack 的是相对固定的
    plugins: loadWebpack.plugins
  }
}
