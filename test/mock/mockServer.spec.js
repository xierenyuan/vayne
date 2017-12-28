import test from 'ava'
import MockServer from '../../packages/vayne-cli/src/mock/mock.js'

const pwd = __dirname

test('getConfig vayne.mock.js not exist', t => {
  t.deepEqual(MockServer.prototype.getConfig(`${pwd}/inexistence`), { config: {}, files: [`${pwd}/inexistence`] }, '没有vayne.mock.js文件返回正确')
})

test('getConfig vayne.mock.js exist', t => {
  t.deepEqual(
    MockServer.prototype.getConfig(`${pwd}/.vayne.mock.js`),
    {
      config: {
        'get /xxx': {
          'object|2': {
            '310000': '上海市',
            '320000': '江苏省',
            '330000': '浙江省',
            '340000': '安徽省'
          }
        }
      },
      files: [`${pwd}/.vayne.mock.js`, `${pwd}/vayneMock/one.js`]
    },
    '存在vayne.mock.js文件返回正确'
  )
})

test('template', t => {
  t.deepEqual(
    MockServer.prototype.template({
      'object|2': {
        '310000': '上海市',
        '320000': '江苏省'
      }
    }),
    {
      'object': {
        '310000': '上海市',
        '320000': '江苏省'
      }
    },
    'template函数返回正确'
  )
})

test('parseKey', t => {
  t.deepEqual(MockServer.prototype.parseKey('get /xxx'), { method: 'get', path: '/xxx' }, '解析请求方式和url')
})

test('outputError', t => {
  t.deepEqual(MockServer.prototype.outputError(), undefined, '没有error')
})

test('applyMock outputError', t => {
  t.throws(() => {
    MockServer.prototype.applyMock(undefined),
    [{ message: 'Path must be a string. Received undefined' }, '']
  })
})
