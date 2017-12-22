const path = require('path')
const fs = require('fs')

module.exports = function (cwd = process.cwd()) {
  const appDirectory = fs.realpathSync(cwd)
  function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath) // eslint-disable-line
  }

  function ownDir(...args) {
    return path.join(__dirname, '../../', ...args)
  }

  return {
    appDice: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appPackageJson: resolveApp('package.json'),
    appNodeModules: resolveApp('node_modules'),
    appSrc: resolveApp('src'),
    ownNodeModules: ownDir('node_modules'),
    resolveApp,
    appDirectory,
    ownDir
  }
}
