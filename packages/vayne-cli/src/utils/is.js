const toString = Object.prototype.toString

function type(obj) {
  return toString.call(obj)
}

exports.isString = obj => type(obj) === '[object String]'
exports.isArray = obj => type(obj) === '[object Array]'
exports.isObject = obj => type(obj) === '[object Object]'
exports.isBoolean = obj => type(obj) === '[object Boolean]'
exports.isFunction = obj => type(obj) === '[object Function]'
exports.nil = obj => obj === null || obj === undefined
