import bingo from '../../..'

const transport = bingo.transport({
  target: 'bingo/file'
})
const logger = bingo(transport)

transport.on('ready', function () {
  logger.info('Hello')
  process.exit(0)
})
