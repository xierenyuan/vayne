const request = require('request')
const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../../package.json')
const os = require('os')
const log = require('./log')

class Version {
  constructor() {
    this.init()
  }

  init() {
    this.initNode()
    this.initVayne()
  }

  initNode() {
    if (!semver.satisfies(process.version, packageConfig.engines.node)) {
      log.error(`node 版本必须 ${packageConfig.engines.node} 才可以使用 vayne`)
      if (os.platform === 'darwin') {
        log.info(`推荐用 ${chalk.cyan('https://github.com/creationix/nvm')} 管理和升级你的 node 版本。`)
      } else if (os.platform === 'win32') {
        log.info(`推荐到 ${chalk.cyan('https://nodejs.org/')} 下载最新的 node 版本。`)
      }
      process.exit(1)
    }
  }

  async initVayne() {
    let body = await this.getLatestVersion()
    if (body === undefined) {
      return
    }
    const latestVersion = JSON.parse(body)['dist-tags'].latest
    const localVersion = packageConfig.version
    if (semver.lt(localVersion, latestVersion)) {
      console.log(chalk.yellow('  一个新版本的 vayne 可以用.'))
      console.log()
      console.log('  latest:    ' + chalk.green(latestVersion))
      console.log('  installed: ' + chalk.red(localVersion))
      console.log(`  upgrade(可使用如下方式升级): `)
      console.log(`  Yarn: ${chalk.bold.magenta('$ yarn global add vayne')} `)
      console.log(`  Npm: ${chalk.bold.magenta('$ npm i -g vayne')} `)
      console.log()
    }
  }

  getLatestVersion() {
    new Promise((reslove, reject) => { // eslint-disable-line
      request({
        url: 'https://registry.npmjs.org/@vayne/cli',
        timeout: 1000
      }, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          reslove(body)
        }
      })
    })
  }
}
module.exports = new Version()
