const fs = require('fs')
const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const paths = require('../utils/path')(process.cwd())
const Mock = require('mockjs')
const log = require('../utils/log')

/**
 *
 * mock服务
 * @class MockServer
 */
class MockServer {
  constructor(devServer) {
    this.error = null
    this.CONFIG_FILE = '.vayne.mock.js'
    this.applyMock(devServer)
  }

  getConfig(filePath) {
    const resolvedFilePath = paths.resolveApp(filePath)
    if (fs.existsSync(resolvedFilePath)) {
      const files = []
      const realRequire = require.extensions['.js']
      require.extensions['.js'] = (m, filename) => {
        if (filename.indexOf(paths.appNodeModules) === -1) {
          files.push(filename)
        }
        delete require.cache[filename]
        return realRequire(m, filename)
      }
      const config = require(resolvedFilePath)  // eslint-disable-line
      require.extensions['.js'] = realRequire
      log.success('获取 vayne.mock 配置')

      return { config, files }
    } else {
      log.warn('你还没有完整的 vayne.mock 配置')
      return {
        config: {},
        files: [resolvedFilePath]
      }
    }
  }

  template(template) {
    return Mock.mock(template)
  }

  createMockHandler(method, path, value) {
    const _this = this
    return function mockHandler(...args) {
      const res = args[1]
      if (typeof value === 'function') {
        value(_this.template, ...args)
      } else {
        res.json(_this.template(value))
      }
    }
  }

  applyMock(devServer) {
    const realRequire = require.extensions['.js']
    try {
      this.realApplyMock(devServer)
      this.error = null
    } catch (e) {
      // 避免 require mock 文件出错时 100% cpu
      require.extensions['.js'] = realRequire

      this.error = e
      this.outputError()
      const watcher = chokidar.watch(paths.resolveApp(this.CONFIG_FILE), {
        ignored: /node_modules/,
        persistent: true
      })
      watcher.on('change', (path) => {
        log.info('修改mock文件', path.replace(paths.appDirectory, '.'))
        watcher.close()
        this.applyMock(devServer)
      })
    }
  }

  realApplyMock(devServer) {
    const ret = this.getConfig(this.CONFIG_FILE)
    const config = ret.config
    const files = ret.files
    const app = devServer.app

    devServer.use(bodyParser.json({ limit: '5mb' }))
    devServer.use(bodyParser.urlencoded({
      extended: true,
      limit: '5mb'
    }))

    Object.keys(config).forEach((key) => {
      const keyParsed = this.parseKey(key)
      if (typeof config[key] === 'function' || typeof config[key] === 'object') {
        app[keyParsed.method](
          keyParsed.path,
          this.createMockHandler(keyParsed.method, keyParsed.path, config[key])
        )
      }
    })

    // 调整 stack，把 historyApiFallback 放到最后
    let lastIndex = null
    app._router.stack.forEach((item, index) => {
      if (item.name === 'webpackDevMiddleware') {
        lastIndex = index
      }
    })
    const mockAPILength = app._router.stack.length - 1 - lastIndex
    if (lastIndex && lastIndex > 0) {
      const newStack = app._router.stack
      newStack.push(newStack[lastIndex - 1])
      newStack.push(newStack[lastIndex])
      newStack.splice(lastIndex - 1, 2)
      app._router.stack = newStack
    }

    const watcher = chokidar.watch(files, {
      ignored: /node_modules/,
      persistent: true
    })
    const _this = this
    watcher.on('change', (path) => {
      log.info('修改mock文件:', path.replace(paths.appDirectory, '.'))
      watcher.close()

      // 删除旧的 mock api
      app._router.stack.splice(lastIndex - 1, mockAPILength)

      _this.applyMock(devServer)
    })
  }

  parseKey(key) {
    let method = 'get'
    let path = key

    if (key.indexOf(' ') > -1) {
      const splited = key.split(' ')
      method = splited[0].toLowerCase()
      path = splited[1]
    }

    return { method, path }
  }

  outputError() {
    if (!this.error) return

    const filePath = this.error.message.split(': ')[0]
    const relativeFilePath = filePath.replace(paths.appDirectory, '.')
    const errors = this.error.stack.split('\n')
      .filter(line => line.trim().indexOf('at ') !== 0)
      .map(line => line.replace(`${filePath}: `, ''))
    errors.splice(1, 0, [''])

    log.error('解析Mock文件失败：', `Error in ${relativeFilePath}`)
  }
}

module.exports = MockServer
