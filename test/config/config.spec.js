import test from 'ava'
import LoadConfig from '../../packages/vayne-cli/src/load.config/index'
import Base from '../../packages/vayne-cli/src/base'
import Commander from '../feature/commander'

let config = null
const pwd = __dirname
let useConfig

test.before(async _t => {
  process.chdir(pwd)
  let commander = new Commander()
  let base = new Base(undefined, commander)
  config = new LoadConfig(base)
  useConfig = await config.useConfig()
})

test('入口文件改为index.js', t => {
  t.is(useConfig.entry.app, 'index.js', '入口文件返回错误')
})

test('assetsSubDirectory is auto', t => {
  t.is(useConfig.dev.assetsSubDirectory, 'auto', 'assetsSubDirectory 值错误')
})

test('port is 1234', t => {
  t.is(useConfig.dev.port, 1234, 'port 值错误')
})

test('NODE_ENV is development', t => {
  t.is(useConfig.build.env.NODE_ENV, '"development"', 'NODE_ENV 值错误')
})

test('productionSourceMap is true', t => {
  t.is(useConfig.build.productionSourceMap, true, 'productionSourceMap 值错误')
})

test('domin is undefined', t => {
  t.is(useConfig.domin, 'undefined', 'domin 值错误')
})

test('name is serve', t => {
  t.is(useConfig.options.name, 'serve', 'name 值错误')
})

test('isDebug is false', t => {
  t.is(useConfig.log.isDebug, false, 'isDebug 值错误')
})

test.after(() => {
  config = null
})
