import bingo from '../../..'

const transport = bingo.transport({
  target: 'bingo-logger/file'
})
const logger = bingo(transport)

logger.info('Hello')

process.exit(0)
