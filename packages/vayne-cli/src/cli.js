require('./utils/version')
require('v8-compile-cache')
const chalk = require('chalk')
const commander = require('commander')
const version = require('../package.json').version
const log = require('./utils/log')

const program = commander

program
  .version(version)

program
  .command('serve [input]')
  .description('启动开发调试模式.')
  .option('-p, --port <port>', '设置服务器端口号. 如以在使用会自动往上累加。 默认是 9000', parseInt)
  .option('-H, --host <host>', 'host .')
  .option('-o, --open', '在默认浏览器中打开.')
  .option('-c, --config', '指定配置文件.')
  .option('-V, --version', 'output the version number.')
  .action(bundle)

program
  .command('build [input]')
  .description('启动生产模式，生成最终的部署代码.')
  .option('-r, --report', 'View the bundle analyzer report after build finishes.')
  .option('-c, --config', '指定配置文件.')
  .action(bundle)

program
  .command('help [command]')
  .description('display help information for a command.')
  .action(function(command) {
    let cmd = program.commands.find(c => c.name() === command) || program
    cmd.help()
  })

program.on('--help', function() {
  console.log('')
  let helpMessage = [
    '  Run: ',
    `${chalk.bold.magenta('$ vayne help <command>')} for more information on specific commands.`,
    '以上所有配置 均可在 vayne 配置文件中配置。',
    '详情见 http://vayne.js.org/'
  ]
  console.log(helpMessage.join('\n  '))
  console.log('')
})

// 默认没有输出提示信息 而是直接启动 vayne serve 所以给下提示
if (!process.argv[2]) {
  // program.help()
  log.warn('没有参数. 默认启动 `vayne serve`')
}

let args = process.argv
if (!args[2] || !program.commands.some(c => c.name() === args[2])) {
  args.splice(2, 0, 'serve')
}

program.parse(args)

async function bundle(cmd, command) {
  const Vayne = require('../')

  const vayne = new Vayne(cmd, command) // eslint-disable-line
  vayne.dev()
}
