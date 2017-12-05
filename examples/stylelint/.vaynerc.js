'use strict'
const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  template: 'index.html',
  plugins: [
    'vayne-plugin-vue',
    'vayne-plugin-stylelint'
  ]
}
