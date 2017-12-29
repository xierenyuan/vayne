import test from 'ava'
import Log from '../../packages/vayne-cli/src/utils/log'
const chalk = require('chalk')

test('isdebug is false', t => {
  t.false(Log.isDebug, 'isdebug 返回值错误')
})

test('success is green', t => {
  t.is(Log.log('success', 'green'), chalk.green('green'), 'success 颜色状态错误')
})

test('info is blue', t => {
  t.is(Log.log('info', 'blue'), chalk.blue('blue'), 'info 颜色状态错误')
})

test('note is white', t => {
  t.is(Log.log('note', 'white'), chalk.white('white'), 'note 颜色状态错误')
})

test('warning is yellow', t => {
  t.is(Log.log('warning', 'yellow'), chalk.yellow('yellow'), 'warning 颜色状态错误')
})

test('error is red', t => {
  t.is(Log.log('error', 'red'), chalk.red('red'), 'error 颜色状态错误')
})

test('others is red', t => {
  t.is(Log.log(' ', 'red'), chalk.red('red'), 'others 颜色状态错误')
})
