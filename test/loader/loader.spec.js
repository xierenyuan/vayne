import test from 'ava'
import defaultConfig from '../../packages/vayne-cli/src/load.config/vayne.config'
import Loaders from '../../packages/vayne-cli/src/webpack/loaders'

let loaders = null

test.before(_t => {
  loaders = new Loaders(Object.assign(defaultConfig, {
    urlLoaderLimit: 8000,
    include: [
      'xxxxx/sss/ss'
    ]
  }))
})

test("include is ['xxxxx/sss/ss']", t => {
  t.deepEqual(loaders.include, ['xxxxx/sss/ss'], 'include 返回不正确')
})

test('urlLoaderLimit is 8000', t => {
  t.is(loaders.limit, 8000, 'limit 不正确')
})

test('emitWarning is true', t => {
  t.is(loaders.rules[0].options.emitWarning, true, 'emitWarning 返回值错误')
})

test('use 里面的四个方法都执行过', t => {
  t.is(loaders.rules.length, 6, 'use 有未执行的方法')
})

test.after(() => {
  loaders = null
})
