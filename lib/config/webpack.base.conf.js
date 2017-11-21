'use strict'
const _ = require('lodash')
const loaders = require('./loaders')

module.exports = (args, config, paths, utils) => {
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
        paths.appDirectory,
        'node_modules',
        paths.ownNodeModules
      ]
    },
    // 全局的三方包
    externals: config.externals || {},
    module: {
      rules: loaders(config, paths, utils)
    }
  }
}
