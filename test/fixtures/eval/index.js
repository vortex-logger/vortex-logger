/* eslint-disable no-eval */

eval(`
const bingo = require('../../../')

const logger = bingo(
  bingo.transport({
    target: 'bingo/file'
  })
)

logger.info('done!')
`)
