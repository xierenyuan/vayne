const {join} = require('path')
const {fork} = require('child_process')
const chokidar = require('chokidar')
const chalk = require('chalk')
const cwd = process.cwd()
const paths = require('../utils/path')(cwd)

// 别的参数
const argv = require('yargs') // eslint-disable-line
.usage('Usage: vayne server [options]')
.option('P', {
  alias: 'port',
  describe: '服务端口号',
  type: 'string'
})
.option('H', {
  alias: 'host',
  describe: 'host',
  type: 'string'
})
.option('O', {
  alias: 'openBrowser',
  describe: '是否打开浏览器',
  type: 'boolean',
  default: false
})
.help('h')
.argv
// 赋值argv 到webpack.dev 中获取
process.env.VAYNE_SERVER_ARGV = JSON.stringify(argv)

let server = null

// 监听文件变更重启服务
function watch () {
  const files = [
    paths.resolveApp('.vaynerc'),
    paths.resolveApp('.vaynerc.js')
  ]
  const watcher = chokidar.watch(files, {
    ignored: /node_modules/,
    persistent: true
  })

  watcher.on('change', (path) => {
    console.log(chalk.green(`File ${path.replace(paths.appDirectory, '.')} changed, try to restart server`))
    watcher.close()
    // 关掉 webpack-derv-server 的进程
    server && server.kill('SIGINT')
    process.send('RESTART')
  })
}

const args = [
  '--inline',
  '--progress'
]
args.push('--config', join(__dirname, './webpack.dev.conf'))
server = fork(join(__dirname, '../../node_modules/webpack-dev-server/bin/webpack-dev-server.js'), args)

watch()
