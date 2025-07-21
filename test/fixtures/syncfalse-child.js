global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('node:os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../'))
const asyncLogger = bingo(bingo.destination({ sync: false })).child({ hello: 'world' })
asyncLogger.info('h')
