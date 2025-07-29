import { zenlog } from '../../zenlog'
import { expectType } from "tsd";

// Single
const transport = zenlog.transport({
    target: '#zenlog/pretty',
    options: { some: 'options for', the: 'transport' }
})
zenlog(transport)

expectType<zenlog.Logger>(zenlog({
    transport: {
        target: 'pino-pretty'
    },
}))

// Multiple
const transports = zenlog.transport({targets: [
    {
        level: 'info',
        target: '#zenlog/pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'trace',
        target: '#zenlog/file',
        options: { destination: './test.log' }
    }
]})
zenlog(transports)

expectType<zenlog.Logger>(zenlog({
    transport: {targets: [
            {
                level: 'info',
                target: '#zenlog/pretty',
                options: { some: 'options for', the: 'transport' }
            },
            {
                level: 'trace',
                target: '#zenlog/file',
                options: { destination: './test.log' }
            }
        ]},
}))

const transportsWithCustomLevels = zenlog.transport({targets: [
    {
        level: 'info',
        target: '#zenlog/pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'foo',
        target: '#zenlog/file',
        options: { destination: './test.log' }
    }
], levels: { foo: 35 }})
zenlog(transports)

expectType<zenlog.Logger>(zenlog({
    transport: {targets: [
            {
                level: 'info',
                target: '#zenlog/pretty',
                options: { some: 'options for', the: 'transport' }
            },
            {
                level: 'trace',
                target: '#zenlog/file',
                options: { destination: './test.log' }
            }
        ], levels: { foo: 35 }
    },
}))

const transportsWithoutOptions = zenlog.transport({
    targets: [
        { target: '#zenlog/pretty' },
        { target: '#zenlog/file' }
    ], levels: { foo: 35 }
})
zenlog(transports)

expectType<zenlog.Logger>(zenlog({
    transport: {
        targets: [
            { target: '#zenlog/pretty' },
            { target: '#zenlog/file' }
        ], levels: { foo: 35 }
    },
}))

const pipelineTransport = zenlog.transport({
    pipeline: [{
        target: './my-transform.js'
    }, {
        // Use target: 'zenlog/file' to write to stdout
        // without any change.
        target: 'pino-pretty'
    }]
})
zenlog(pipelineTransport)

expectType<zenlog.Logger>(zenlog({
    transport: {
        pipeline: [{
            target: './my-transform.js'
        }, {
            // Use target: 'zenlog/file' to write to stdout
            // without any change.
            target: 'pino-pretty'
        }]
    }
}))

type TransportConfig = {
    id: string
}

// Custom transport params
const customTransport = zenlog.transport<TransportConfig>({
    target: 'custom',
    options: { id: 'abc' }
})
zenlog(customTransport)

// Worker
zenlog.transport({
    target: 'custom',
    worker: {
        argv: ['a', 'b'],
        stdin: false,
        stderr: true,
        stdout: false,
        autoEnd: true,
    },
    options: { id: 'abc' }
})

// Dedupe
zenlog.transport({
    targets: [],
    dedupe: true,
})
