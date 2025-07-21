'use strict'
const bingo = require('../..')
const log = bingo({
  transport: {
    target: 'bingo-logger/file',
    options: { destination: 1 }
  }
})
log.info('hello world!')
process.on('exit', (code) => {
  log.info('Exiting peacefully')
})
