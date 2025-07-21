'use strict'

const bingo = require('../..')
const transport = bingo.transport({
  target: 'bingo-logger/file'
})
const logger = bingo(transport)

transport.on('ready', function () {
  logger.info('Hello')
  process.exit(0)
})
