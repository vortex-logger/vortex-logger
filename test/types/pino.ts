import { bingo } from '../../bingo'
import { join } from 'path'
import { tmpdir } from 'os'

const destination = join(
    tmpdir(),
    '_' + Math.random().toString(36).substr(2, 9)
)

// Single
const transport = bingo.transport({
    target: 'bingo-pretty',
    options: { some: 'options for', the: 'transport' }
})
const logger = bingo(transport)
logger.setBindings({ some: 'bindings' })
logger.info('test2')
logger.flush()

const transport2 = bingo.transport({
    target: 'bingo-pretty',
})
const logger2 = bingo(transport2)
logger2.info('test2')


// Multiple

const transports = bingo.transport({targets: [
    {
        level: 'info',
        target: 'bingo-pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'trace',
        target: 'bingo/file',
        options: { destination }
    }
]})
const loggerMulti = bingo(transports)
loggerMulti.info('test2')
