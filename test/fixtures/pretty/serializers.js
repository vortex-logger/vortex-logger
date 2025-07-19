global.process = { __proto__: process, pid: 123456 }
Date.now = function () { return 1459875739796 }
require('os').hostname = function () { return 'abcdefghijklmnopqr' }
const bingo = require(require.resolve('./../../../'))
const log = bingo({
  prettyPrint: true,
  serializers: {
    foo (obj) {
      if (obj.an !== 'object') {
        throw new Error('kaboom')
      }

      return 'bar'
    }
  }
})
log.info({ foo: { an: 'object' } }, 'h')
