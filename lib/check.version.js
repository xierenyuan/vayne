const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../package.json')
const os = require('os')

module.exports = done => {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    console.log(chalk.red(`node 版本必须大于 >= ${packageConfig.engines.node} 才可以使用 vayne`))
    if (os.platform === 'darwin') {
      console.log(`推荐用 ${chalk.cyan('https://github.com/creationix/nvm')} 管理和升级你的 node 版本。`)
    } else if (os.platform === 'win32') {
      console.log(`推荐到 ${chalk.cyan('https://nodejs.org/')} 下载最新的 node 版本。`)
    }
    process.exit(1)
  }
  request({
    url: 'https://registry.npmjs.org/vayne',
    timeout: 1000
  }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const latestVersion = JSON.parse(body)['dist-tags'].latest
      const localVersion = packageConfig.version
      if (semver.lt(localVersion, latestVersion)) {
        console.log(chalk.yellow('  一个新版本的 vayne 可以用.'))
        console.log()
        console.log('  latest:    ' + chalk.green(latestVersion))
        console.log('  installed: ' + chalk.red(localVersion))
        console.log()
      }
    }
    done && done()
  })
}
