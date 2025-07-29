import { join } from 'node:path'
import zenlog from '../../../zenlog'

const transport = zenlog.transport({
  target: join(__dirname, 'transport-worker.ts')
})
const logger = zenlog(transport)
logger.info('Hello')
