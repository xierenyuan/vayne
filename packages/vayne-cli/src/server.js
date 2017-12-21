const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const net = require('net')
const open = require('opn')
const addDevServerEntrypoints = require('webpack-dev-server/lib/util/addDevServerEntrypoints')
const createDomain = require('webpack-dev-server/lib/util/createDomain')
const log = require('./utils/log')

/**
 *
 * 本地服务
 * @see https://doc.webpack-china.org/configuration/dev-server/
 * @class Serve
 */
class Serve {
  constructor(webpackConfig) {
    this.webpackConfig = webpackConfig
    let options = webpackConfig.devServer
    this.options = options
    this.suffix = (options.inline !== false || options.lazy === true ? '/' : '/webpack-dev-server/')
    this.startDevServer()
  }

  // 重启时关闭 启动的服务
  kill() {
    this.server && this.server.close()
  }

  startDevServer() {
    let webpackConfig = this.webpackConfig
    let options = this.options
    addDevServerEntrypoints(webpackConfig, options)
    this.createCompiler()
    this.createServer()
    this.process()
    if (options.socket) {
      this.createSocket()
    } else {
      this.createPort()
    }
  }

  createCompiler() {
    try {
      this.compiler = webpack(this.webpackConfig)
      this.compiler.apply(new webpack.ProgressPlugin({
        profile: this.options.profile
      }))
    } catch (e) {
      if (e instanceof webpack.WebpackOptionsValidationError) {
        console.error(log.error(e.message))
        process.exit(1)
      }
      throw e
    }
  }

  createServer() {
    try {
      this.server = new WebpackDevServer(this.compiler, this.options)
    } catch (e) {
      const OptionsValidationError = require('webpack-dev-server/lib/OptionsValidationError')
      if (e instanceof OptionsValidationError) {
        console.error(log.error(e.message))
        process.exit(1)
      }
      throw e
    }
  }

  process() {
    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        this.server.close(() => {
          process.exit()
        })
      })
    })
  }

  createSocket() {
    let server = this.server
    let options = this.options
    this.server.listeningApp.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        const clientSocket = new net.Socket()
        clientSocket.on('error', (clientError) => {
          if (clientError.code === 'ECONNREFUSED') {
            // No other server listening on this socket so it can be safely removed
            fs.unlinkSync(this.options.socket)
            this.server.listen(this.options.socket, this.options.host, (err) => {
              if (err) throw err
            })
          }
        })
        clientSocket.connect({ path: this.options.socket }, () => {
          throw new Error('This socket is already used')
        })
      }
    })

    server.listen(options.socket, options.host, (err) => {
      if (err) throw err
      // chmod 666 (rw rw rw)
      const READ_WRITE = 438
      fs.chmod(options.socket, READ_WRITE, (fsError) => {
        if (fsError) throw fsError

        const uri = createDomain(options, server.listeningApp) + this.suffix
        this.reportReadiness(uri, options)
      })
    })
  }

  createPort() {
    let server = this.server
    let options = this.options
    server.listen(options.port, options.host, (err) => {
      if (err) throw err
      if (options.bonjour) this.broadcastZeroconf(options)

      const uri = createDomain(options, server.listeningApp) + this.suffix
      this.reportReadiness(uri, options)
    })
  }

  reportReadiness(uri, options) {
    const useColor = options.color
    const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(', ') : options.contentBase

    if (!options.quiet) {
      let startSentence = `Project is running at ${log.info(uri)}`
      if (options.socket) {
        startSentence = `Listening to socket at ${log.info(options.socket)}`
      }
      console.log((options.progress ? '\n' : '') + startSentence)

      console.log(`webpack output is served from ${log.info(options.publicPath)}`)

      if (contentBase) { console.log(`Content not from webpack is served from ${log.info(contentBase)}`) }

      if (options.historyApiFallback) { console.log(`404s will fallback to ${log.info(useColor, options.historyApiFallback.index || '/index.html')}`) }

      if (options.bonjour) { console.log('Broadcasting "http" with subtype of "webpack" via ZeroConf DNS (Bonjour)') }
    }

    if (options.open) {
      let openOptions = {}
      let openMessage = 'Unable to open browser'

      if (typeof options.open === 'string') {
        openOptions = { app: options.open }
        openMessage += `: ${options.open}`
      }

      open(uri + (options.openPage || ''), openOptions).catch(() => {
        console.log(`${openMessage}. If you are running in a headless environment, please do not use the open flag.`)
      })
    }
  }

  broadcastZeroconf(options) {
    const bonjour = require('bonjour')()
    bonjour.publish({
      name: 'Webpack Dev Server',
      port: options.port,
      type: 'http',
      subtypes: ['webpack']
    })
    process.on('exit', () => {
      bonjour.unpublishAll(() => {
        bonjour.destroy()
      })
    })
  }
}
module.exports = Serve
