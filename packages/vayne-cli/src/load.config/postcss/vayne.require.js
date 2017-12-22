const resolve = require('resolve')
const is = require('../../utils/is')
const log = require('../../utils/log')

const cache = new Map()

function getModulePath(name, path) {
  let basedir = path
  let key = basedir + ':' + name
  let resolved = cache.get(key)
  if (!resolved) {
    resolved = resolve.sync(name, {basedir})
    cache.set(key, resolved)
  }
  return resolved
}

module.exports = (name, path, options) => {
  let resolved
  try {
    resolved = getModulePath(name, __dirname)
  } catch (error) {
    try {
      resolved = getModulePath(name, path)
    } catch (error) {
      log.fatal(`Loading PostCSS Plugin failed: 找不到【${name}】。 Did you forget to install it?\n npm install ${name} --save-dev \n or yarn add ${name} -D `)
    }
  }
  if (is.nil(options) || Object.keys(options).length === 0) {
    return require(resolved)
  } else {
    return require(resolved)(options)
  }
}
