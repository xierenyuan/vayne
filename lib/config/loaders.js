const _ = require('lodash')
const vueLoaderConfig = require('./vue-loader.conf')

module.exports = (config, paths, utils) => {
  let rules = []
  // 编译
  const include = _.uniq([
    paths.resolveApp('src'),
    paths.resolveApp('test'),
    paths.resolveApp('node_modules/@rrc')
  ], config.include || [])
  // limit
  const limit = config.urlLoaderLimit || 10000
  const useVue = config.dev.useVue || true
  if (config.dev.useEslint) {
    rules.push({
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: include,
      options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
      }
    })
  }

  // 加载Vue 默认的加载
  if (useVue) {
    rules.push({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig(config, utils)
    })
  }

  // js
  rules.push({
    test: /\.js$/,
    loader: 'babel-loader',
    include: include
  })

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
      limit: 10000,
      name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
    }
  })

  return rules
}
