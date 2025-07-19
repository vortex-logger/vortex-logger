'use strict'

global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('os').hostname = function () { return 'abcdefghijklmnopqr' }

const bingo = require('../../..')
const logger = bingo(bingo.destination())

logger.info('hello world')
