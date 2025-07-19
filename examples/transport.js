'use strict'

const bingo = require('..')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const file = join(tmpdir(), `bingo-${process.pid}-example`)

const transport = bingo.transport({
  targets: [{
    level: 'warn',
    target: 'bingo/file',
    options: {
      destination: file
    }
    /*
  }, {
    level: 'info',
    target: 'bingo-elasticsearch',
    options: {
      node: 'http://localhost:9200'
    }
    */
  }, {
    level: 'info',
    target: 'bingo-pretty'
  }]
})

const logger = bingo(transport)

logger.info({
  file
}, 'logging destination')

logger.info('hello world')
logger.error('this is at error level')
logger.info('the answer is %d', 42)
logger.info({ obj: 42 }, 'hello world')
logger.info({ obj: 42, b: 2 }, 'hello world')
logger.info({ nested: { obj: 42 } }, 'nested')
logger.warn('WARNING!')
setImmediate(() => {
  logger.info('after setImmediate')
})
logger.error(new Error('an error'))

const child = logger.child({ a: 'property' })
child.info('hello child!')

const childsChild = child.child({ another: 'property' })
childsChild.info('hello baby..')

logger.debug('this should be mute')

logger.level = 'trace'

logger.debug('this is a debug statement')

logger.child({ another: 'property' }).debug('this is a debug statement via child')
logger.trace('this is a trace statement')

logger.debug('this is a "debug" statement with "')

logger.info(new Error('kaboom'))
logger.info(null)

logger.info(new Error('kaboom'), 'with', 'a', 'message')
