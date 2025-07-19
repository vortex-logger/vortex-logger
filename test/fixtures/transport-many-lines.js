'use strict'

const bingo = require('../..')
const transport = bingo.transport({
  targets: [{
    level: 'info',
    target: 'bingo-logger/file',
    options: {
      destination: process.argv[2]
    }
  }]
})
const logger = bingo(transport)

const toWrite = 1000000
transport.on('ready', run)

let total = 0

function run () {
  if (total++ === 8) {
    return
  }

  for (let i = 0; i < toWrite; i++) {
    logger.info(`hello ${i}`)
  }
  transport.once('drain', run)
}
