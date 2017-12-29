import test from 'ava'
import Base from '../../packages/vayne-cli/src/base'
import Commander from '../feature/commander'

let base = null

test.before(_t => {
  let commander = new Commander()
  base = new Base(undefined, Object.assign(commander, {
    cName: 'build',
    port: 8000
  }))
})

test('当前运行环境为 true', t => {
  t.true(base.isEnv(base.options.env), '当前运行环境不是true')
})

test('port is 8000', t => {
  t.is(base.options.port, 8000, 'port错误')
})

test('name为build 时 生产环境为production', t => {
  t.is(base.options.env, 'production', 'name为build 时 生产环境为输出错误')
})
