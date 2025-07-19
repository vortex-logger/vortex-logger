global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('node:os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../'))
const dest = bingo.destination({ dest: 1, minLength: 4096, sync: false })
const logger = bingo({}, dest)
logger.info('hello')
logger.info('world')
dest.flushSync()
process.exit(0)
