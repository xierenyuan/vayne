module.exports = {
  entry: {
    app: './index.js'
  },
  template: 'index.html',
  'plugins': [
    require('../index')
  ],
  vue: {
    usePostCss: false
  }
}
