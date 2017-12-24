import test from 'ava'
// import {join} from 'path'
import Commander from '../feature/commander'
import Vayne from '../../packages/vayne-cli/index'

let serverConfig = null
const pwd = __dirname

test.before(async _t => {
  // 因为单个测试的 vayne 配置在单个文件下 所以需要切换 访问地址在当前目录下 @see http://javascript.ruanyifeng.com/nodejs/process.html#toc7
  process.chdir(pwd)
  let commander = new Commander()
  let vayne = new Vayne(undefined, commander)
  serverConfig = await vayne.dev()
})

test('port is 9000', t => {
  t.is(serverConfig.devServer.port, 9000, '端口号不正确')
})

test('host is 0.0.0.0', t => {
  t.is(serverConfig.devServer.host, '0.0.0.0', 'host 不正确')
})

test('open is false', t => {
  t.is(serverConfig.devServer.open, false, 'open 不正确')
})

test('context 基础目录 等于当前目录', t => {
  t.is(serverConfig.context, pwd, 'context 路径不正确')
})

test('entry', t => {
  t.is(serverConfig.entry.app, './src/index.js', '默认入口不正确')
})

test.after(() => {
  serverConfig = null
})
