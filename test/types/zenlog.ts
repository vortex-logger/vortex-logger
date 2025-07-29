import { join } from 'node:path'
import { tmpdir } from 'node:os'
import pinoPretty from 'pino-pretty'
import { LoggerOptions, StreamEntry, zenlog } from '../../zenlog'

const destination = join(
    tmpdir(),
    '_' + Math.random().toString(36).substr(2, 9)
)

// Single
const transport = zenlog.transport({
    target: 'pino-pretty',
    options: { some: 'options for', the: 'transport' }
})
const logger = zenlog(transport)
logger.setBindings({ some: 'bindings' })
logger.info('test2')
logger.flush()

const transport2 = zenlog.transport({
    target: 'pino-pretty',
})
const logger2 = zenlog(transport2)
logger2.info('test2')


// Multiple

const transports = zenlog.transport({targets: [
    {
        level: 'info',
        target: 'pino-pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'trace',
        target: 'zenlog/file',
        options: { destination }
    }
]})
const loggerMulti = zenlog(transports)
loggerMulti.info('test2')

// custom levels

const customLevels = {
    customDebug   : 1,
    info    : 2,
    customNetwork : 3,
    customError   : 4,
};

type CustomLevels = keyof typeof customLevels;

const zenlogOpts = {
    useOnlyCustomLevels: true,
    customLevels: customLevels,
    level: 'customDebug',
} satisfies LoggerOptions;

const multistreamOpts = {
    dedupe: true,
    levels: customLevels
};

const streams: StreamEntry<CustomLevels>[] = [
    { level : 'customDebug',   stream : pinoPretty() },
    { level : 'info',    stream : pinoPretty() },
    { level : 'customNetwork', stream : pinoPretty() },
    { level : 'customError',   stream : pinoPretty() },
];

const loggerCustomLevel = zenlog(zenlogOpts, zenlog.multistream(streams, multistreamOpts));
loggerCustomLevel.customDebug('test3')
loggerCustomLevel.info('test4')
loggerCustomLevel.customError('test5')
loggerCustomLevel.customNetwork('test6')
