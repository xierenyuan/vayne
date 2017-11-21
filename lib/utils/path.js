const path = require('path')
const fs = require('fs')

module.exports = function (cwd) {
  const appDirectory = fs.realpathSync(cwd)
  function resolveApp (relativePath) {
    return path.resolve(appDirectory, relativePath) // eslint-disable-line
  }

  return {
    appDice: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appPackageJson: resolveApp('package.json'),
    appNodeModules: resolveApp('node_modules'),
    appSrc: resolveApp('src'),
    ownNodeModules: path.resolve(__dirname, '../../node_modules'),
    resolveApp,
    appDirectory
  }
}
