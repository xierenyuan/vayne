'use strict'
const _ = require('lodash')
const vueLoaderConfig = require('./vue-loader.conf')

function loaders(config, paths, utils) {
  let rules = []
  // 因为这里有json 配置的原因 是否最后考虑 循环给加上当前项目路径
  const include = _.uniq([
    paths.resolveApp('src'),
    paths.resolveApp('test'),
    paths.resolveApp('node_modules/@rrc')
  ], config.include || [])

  const limit = config.urlLoaderLimit || 10000

  // eslint loader
  rules.push({
    test: config.isNg ? /\.js$/ : /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [paths.resolveApp('src'), paths.resolveApp('test')],
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  })

  // babel loader
  rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    include: include
  })

  // 不是ng1 就是vue
  if (!config.isNg) {
    // vue loader
    rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig(config, utils)
    })
  }

  // assets
  rules.push({
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: limit,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
    }
  })

  rules.push({
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: limit,
      name: utils.assetsPath('media/[name].[hash:7].[ext]')
    }
  })

  rules.push({
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: limit,
      name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
    }
  })
  return rules
}

module.exports = function(args, config, paths, utils) {
  const entry = config.entry || {
    app: `${paths.appSrc}/index.js`
  }
  // config.dev.assetsPublicPath update appDirectory
  const output = config.output || {
    path: paths.resolveApp(config.build.assetsRoot),
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  }
  // 全局变量配置
  const alias = _.assign({
    'vue$': 'vue/dist/vue.esm.js',
    'assets': paths.resolveApp('src/assets'),
    '@': paths.resolveApp('src'),
    '*': paths.appDirectory
  }, config.alias || {})
  return {
    entry: entry,
    output: output,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
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
