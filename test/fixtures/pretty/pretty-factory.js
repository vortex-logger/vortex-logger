global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../../'))
const log = bingo({ prettyPrint: { levelFirst: true }, prettifier: require('pino-pretty').prettyFactory })
log.info('h')
