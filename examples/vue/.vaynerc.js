'use strict'
const path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  template: 'index.html',
  plugins: [
    require('../../packages/vayne-plugin-vue')
  ],
  dev: {
    port: 9000
  }
}
