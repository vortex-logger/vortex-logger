'use strict'

const bingo = require('../..')
const transport = bingo.transport({
  target: './to-file-transport-with-transform.js',
  options: {
    destination: process.argv[2]
  }
})
const logger = bingo(transport)

logger.info('Hello')

logger.info('World')

process.exit(0)
