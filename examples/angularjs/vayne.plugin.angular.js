const {resolve} = require('path')
/**
 *
 * vayne angularjs 插件
 * @class VaynePluginAngular
 */
class VaynePluginAngular {
  constructor(config, log) {
    log.debug('开始解析 vayne angularjs插件')
    // 标识插件 name
    this.name = 'VaynePluginAngular'
    return {
      loaders: this.init(config)
    }
  }

  initJsLoader(config) {
    return {
      test: /\.js$/,
      use: [
        {
          loader: 'ng-annotate-loader',
          options: {
            ngAnnotate: 'ng-annotate-patched',
            es6: true,
            explicitOnly: false
          }
        },
        {
          loader: 'babel-loader'
        }
      ],
      include: config.include
    }
  }

  initTempLoader(config) {
    return {
      test: /\.(htm|html)$/,
      use: [
        {
          loader: 'ngtemplate-loader',
          options: {
            relativeTo: resolve(config.appDirectory, '/src/')
          }
        },
        {
          loader: 'html-loader',
          options: {
            minimize: !config.build.productionSourceMap,
            attrs: ['img:data-src', 'img:src']
          }
        }
      ]
    }
  }

  init(config) {
    return [
      this.initJsLoader(config),
      this.initTempLoader(config)
    ]
  }
}

module.exports = VaynePluginAngular
