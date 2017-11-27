const fs = require('fs')
const stripJsonComments = require('strip-json-comments')
const parseJSON = require('parse-json-pretty')
const chalk = require('chalk')
const merge = require('webpack-merge')
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

module.exports = function(env, cwd) {
  const paths = getPaths(cwd)
  let config = getConfig('.vaynerc', paths)
  return merge(defaultConfig, config)
}
