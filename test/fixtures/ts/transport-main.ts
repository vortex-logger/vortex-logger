import { join } from 'path'
import bingo from '../../..'

const transport = bingo.transport({
  target: join(__dirname, 'transport-worker.ts')
})
const logger = bingo(transport)
logger.info('Hello')
