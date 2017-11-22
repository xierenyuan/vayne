/**
 * 日志类
 * @see 参考 cooking.logger
 */
const format = require('util').format
const chalk = require('chalk')
const version = require('../package.json').version

/**
 * Prefix.
 */
const prefix = `VAYNE@${version}`
const sep = chalk.gray('-')
// 开启debug 模式 发布的时候设为false
const isDebug = true

exports.title = function(severity) {
  return chalk[bgColor(severity)].black('', prefix, '')
}

/**
 * Log 调试模式 日志 只在开启的时候 使用
 */
exports.debug = function() {
  if (isDebug) {
    const msg = format.apply(format, arguments)
    console.log(chalk.bgMagenta.black('', 'Vayne', '', 'DEBUG', ''), chalk.magenta(msg))
  }
}

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */
exports.info = function () {
  const msg = format.apply(format, arguments)
  console.log(exports.title('info'), sep, exports.log('info', msg))
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */
exports.fatal = function (message) {
  exports.error(message)

  if (process.env.NODE_ENV === 'testing') {
    throw new Error('exit')
  } else {
    process.exit(1)
  }
}

/**
 * Log an error `message` to the console and no exit.
 *
 * @param {String} message
 */
exports.error = function (message) {
  if (message instanceof Error) {
    message = message.message.trim()
  }

  const msg = format.apply(format, arguments)
  console.error(exports.title('error'), sep, exports.log('error', msg))
}

exports.warn = function () {
  const msg = format.apply(format, arguments)
  console.log(exports.title('warning'), sep, exports.log('warning', msg))
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */
exports.success = function () {
  const msg = format.apply(format, arguments)
  console.log(exports.title('success'), sep, exports.log('success', msg))
}

/**
 *
 * Log 普通日志
 *
 * @param {any} severity 严重级别 @see textColor
 * @param {any} message 消息
 * @returns 返回format 后的log
 */
exports.log = function(severity, message) {
  return chalk[textColor(severity)](message)
}

function bgColor(severity) {
  const color = textColor(severity)
  return 'bg' + capitalizeFirstLetter(color)
}

function textColor(serverity) {
  switch (serverity.toLowerCase()) {
    case 'success': return 'green'
    case 'info': return 'blue'
    case 'note': return 'white'
    case 'warning': return 'yellow'
    case 'error': return 'red'
    default: return 'red'
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
