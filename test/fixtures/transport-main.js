'use strict'

const { join } = require('path')
const bingo = require('../..')
const transport = bingo.transport({
  target: join(__dirname, 'transport-worker.js')
})
const logger = bingo(transport)
logger.info('Hello')
