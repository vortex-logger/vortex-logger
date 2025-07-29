import bingo from '../../../zenlog'

const transport = bingo.transport({
  target: 'bingo-logger/file'
})
const logger = bingo(transport)

logger.info('Hello')

process.exit(0)
