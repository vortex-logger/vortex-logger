import zenlog from '../../../zenlog'
import { join } from 'node:path'

const transport = zenlog.transport({
  target: join(__dirname, 'to-file-transport-with-transform.ts'),
  options: {
    destination: process.argv[2]
  }
})
const logger = zenlog(transport)

logger.info('Hello')
logger.info('World')

process.exit(0)
