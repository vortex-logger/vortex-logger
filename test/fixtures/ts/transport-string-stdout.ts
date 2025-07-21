import bingo from '../../..'

const transport = bingo.transport({
  target: 'bingo-logger/file',
  options: { destination: '1' }
})
const logger = bingo(transport)
logger.info('Hello')
