#!/usr/bin/env node
const chokidar = require('chokidar')
const log = require('./utils/log')
const paths = require('./utils/path')()
const Vayne = require('../')
const Server = require('./server')

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

function watch(server, cmd, command) {
  const files = [
    paths.resolveApp('.vaynerc'),
    paths.resolveApp('.vaynerc.json'),
    paths.resolveApp('.vaynerc.js'),
    paths.resolveApp('vayne.config.js')
  ]
  if (command.config) {
    files.push(paths.resolveApp(command.config))
  }

  const watcher = chokidar.watch(files, {
    ignored: /node_modules/,
    persistent: true
  })

  watcher.on('change', (path) => {
    clearConsole()
    log.success(`File ${path.replace(paths.appDirectory, '.')} changed, try to restart server`)
    watcher.close()
    // 关掉 webpack-derv-server 的进程
    server.kill()
    runServer(cmd, command)
  })
}

const runServer = async(cmd, command) => {
  try {
    const vayne = new Vayne(cmd, command)
    let webpackConfig = await vayne.dev()
    let server = new Server(webpackConfig)
    watch(server, cmd, command)
  } catch (error) {
    console.error(error)
  }
}

module.exports = (cmd, command) => {
  runServer(cmd, command)
}
