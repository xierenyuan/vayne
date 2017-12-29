module.exports = {
  entry: {app: 'index.js'},
  dev: {
    assetsSubDirectory: 'auto',
    port: 1234
  },
  build: {
    env: {NODE_ENV: '"development"'},
    productionSourceMap: true
  },
  domin: 'undefined',
  // 读取到的配置 修改不生效
  options: {
    env: 'build'
  },
  log: {
    isDebug: true
  }
}
