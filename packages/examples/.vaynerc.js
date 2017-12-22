'use strict'
const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  template: 'index.html',
  plugins: [
    require('./vayne.stylelint')
  ],
  vue: {
    usePostCSS: false
  }
}
