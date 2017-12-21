#!/usr/bin/env node
'use strict'
const importLocalFile = require('import-local-file')
const localFile = importLocalFile(__filename)

if (localFile) {
  console.log('> Using local installed version of Vayne')
  require(localFile)
} else {
  // Code for both global and local version
  require('./run')
}
