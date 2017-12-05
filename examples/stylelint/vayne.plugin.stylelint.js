const StyleLintPlugin = require('stylelint-webpack-plugin')
/**
 *
 * vayne stylelint 插件
 * @param {any} config vayne 配置
 * @param {any} log  vayne log
 * @param {any} utils vayne 工具库
 * @returns webpack stylelint plugins
 */
class VaynePluginStyleLint {
  constructor(config, log) {
    log.debug('开始解析 vayne stylelint 插件')
    this.name = 'VaynePluginStyleLint'

    return {
      plugins: [
        new StyleLintPlugin({
          files: ['src/**/*.vue', 'src/**/*.scss']
        })
      ]
    }
  }
}

module.exports = VaynePluginStyleLint
