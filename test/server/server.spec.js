import test from 'ava'
import {join} from 'path'

let serverConfig = null
const pwd = __dirname

test.before(async _t => {
  process.env.VAYNE_SERVER_ARGV = JSON.stringify({
    prot: 7788
  })
  // 因为单个测试的 vayne 配置在单个文件下 所以需要切换 访问地址在当前目录下 @see http://javascript.ruanyifeng.com/nodejs/process.html#toc7
  process.chdir(pwd)
  serverConfig = await require('../../lib/config/webpack.dev.conf')
})

test('port is 7788', t => {
  // console.log(serverConfig)
  t.is(serverConfig.devServer.port, 7788, '端口号不正确')
})

test('context 基础目录 等于当前目录', t => {
  t.is(serverConfig.context, pwd, 'context 路径不正确')
})

test('entry', t => {
  t.is(serverConfig.entry.app, './src/index.js', '默认入口不正确')
})

test('output', t => {
  t.is(serverConfig.output.path, join(pwd, 'dist'), `output dist vaule is ${pwd}/..dist`)
})

test.after(() => {
  serverConfig = null
})
