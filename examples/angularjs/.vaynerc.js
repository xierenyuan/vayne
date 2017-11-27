'use strict'
const path = require('path')

module.exports = {
  plugins: [
    // require('./vayne.plugin.angular')
    'vayne-plugin-angularjs'
  ],
  externals: {
    'angular': 'angular',
    'angular-ui-router': '"ui.router"',
    'angular-animate': '"ngAnimate"',
    'angular-aria': '"ngAria"',
    'angular-material': '"ngMaterial"',
    'jquery': 'jQuery'
  }
}
