const _ = require('lodash')
const QiniuPlugin = require('./qiniu')

// 默认配置
const defaultOptions = {
  isDisable: false,
  batch: 20,
  path: '[hash]',
  exclude: /index\.html$/ // 排除特定的文件
}

/**
 *
 * vayne qiniu 七牛云上传插件
 * @param {any} config vayne context
 * @returns webpack qiniu plugins
 */
class VaynePluginQiniu {
  constructor({extendWebpack, options, log}) {
    log.debug('开始解析 vayne qiniu 插件')
    let qiniu = options.qiniu || {}
    let opts = _.assign(defaultOptions, qiniu)
    opts.log = log
    log.debug(opts)
    this.name = 'VaynePluginQiniu'

    if (opts.isDisable) {
      log.warn('VaynePluginQiniu 插件以被禁用 可设置isDisable 未false 开启 ')
      return {}
    }

    // 校验必填的列
    const vaildField = ['accessKey', 'secretKey', 'bucket', 'path']
    vaildField.forEach(field => {
      let val = opts[field]
      if (_.isUndefined(val)) {
        log.fatal(`VaynePluginQiniu 插件 参数${field} 必须填写`)
      }
    })

    const qiniuPlugin = new QiniuPlugin(opts)

    // 生产环境 才会具有此插件
    extendWebpack('production', webpackConfig => {
      webpackConfig.plugins.push(qiniuPlugin)
    })
  }
}

module.exports = VaynePluginQiniu
