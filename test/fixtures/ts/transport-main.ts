import { join } from 'node:path'
import bingo from '../../../zenlog'

const transport = bingo.transport({
  target: join(__dirname, 'transport-worker.ts')
})
const logger = bingo(transport)
logger.info('Hello')
