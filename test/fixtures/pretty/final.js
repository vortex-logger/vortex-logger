global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../../'))
const log = bingo({ prettyPrint: true })
log.info('h')
process.once('beforeExit', bingo.final(log, (_, logger) => {
  logger.info('beforeExit')
}))
