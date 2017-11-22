module.exports = function(config, log) {
  log.debug('开始解析 vayne vue插件')
  return {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  }
}
