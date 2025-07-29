import bingo from '../../../zenlog'
import { join } from 'node:path'

const transport = bingo.transport({
  target: join(__dirname, 'to-file-transport-with-transform.ts'),
  options: {
    destination: process.argv[2]
  }
})
const logger = bingo(transport)

logger.info('Hello')
logger.info('World')

process.exit(0)
