const fs = require('fs')
const _ = require('lodash')
const stripJsonComments = require('strip-json-comments')
const parseJSON = require('parse-json-pretty')
const chalk = require('chalk')
const getPaths = require('./path')
const defaultConfig = require('./vayne.config')

function getConfig(configFile, paths) {
  const rcConfig = paths.resolveApp(configFile)
  const jsConfig = paths.resolveApp(`${configFile}.js`)
  if (fs.existsSync(rcConfig)) {
    if (fs.existsSync(jsConfig)) {
      console.error(chalk.red(`Config error: 你必须删除 ${rcConfig} 如果你想用 ${jsConfig}配置的话。`))
    }
    return parseJSON(stripJsonComments(fs.readFileSync(rcConfig, 'utf-8')), configFile)
  } else if (fs.existsSync(jsConfig)) {
    return require(jsConfig)
  } else {
    console.error(`Config invalid: ${chalk.red('你还没有完整的vayne 配置')}。`)
    return {}
  }
}

/**
 *
 * 获取 外部指定的配置文件
 * @param {any} file 尾部文件地址
 * @param {any} paths
 * @returns 返回配置文件
 */
function getConfigFile(file, paths) {
  const config = paths.resolveApp(file)
  if (fs.existsSync(config)) {
    return require(config)
  } else {
    console.error(`Config invalid: ${chalk.red('指定的 config 配置文件不存在 或找不到')}。`)
    return {}
  }
}

module.exports = function(env, cwd) {
  const paths = getPaths(cwd)
  const argv = JSON.parse(process.env.VAYNE_SERVER_ARGV || {})
  // 如果指定了配置文件 使用 指定的配置文件
  if (argv.config) {
    return _.assign(defaultConfig, getConfigFile(argv.config, paths))
  }
  let config = getConfig('.vaynerc', paths)
  return _.assign(defaultConfig, config)
}
