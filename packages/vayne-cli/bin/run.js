#!/usr/bin/env node
'use strict'

module.exports =
parseInt(process.versions.node, 10) < 8
  ? require('../lib/cli')
  : require('../src/cli')
