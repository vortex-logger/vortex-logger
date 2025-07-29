import zenlog from '../../../zenlog'

const transport = zenlog.transport({
  target: 'zenlog/file',
  options: { destination: '1' }
})
const logger = zenlog(transport)
logger.info('Hello')
