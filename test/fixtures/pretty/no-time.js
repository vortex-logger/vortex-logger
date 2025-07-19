global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../../'))
const log = bingo({
  timestamp: false,
  prettyPrint: true
})
log.info('h')
