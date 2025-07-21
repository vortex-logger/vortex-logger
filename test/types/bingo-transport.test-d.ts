import { bingo } from '../../bingo-logger'
import { expectType } from "tsd";

// Single
const transport = bingo.transport({
    target: '#bingo/pretty',
    options: { some: 'options for', the: 'transport' }
})
bingo(transport)

expectType<bingo.Logger>(bingo({
    transport: {
        target: 'bingo-pretty'
    },
}))

// Multiple
const transports = bingo.transport({targets: [
    {
        level: 'info',
        target: '#bingo/pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'trace',
        target: '#bingo-logger/file',
        options: { destination: './test.log' }
    }
]})
bingo(transports)

expectType<bingo.Logger>(bingo({
    transport: {targets: [
            {
                level: 'info',
                target: '#bingo/pretty',
                options: { some: 'options for', the: 'transport' }
            },
            {
                level: 'trace',
                target: '#bingo-logger/file',
                options: { destination: './test.log' }
            }
        ]},
}))

const transportsWithCustomLevels = bingo.transport({targets: [
    {
        level: 'info',
        target: '#bingo/pretty',
        options: { some: 'options for', the: 'transport' }
    },
    {
        level: 'foo',
        target: '#bingo-logger/file',
        options: { destination: './test.log' }
    }
], levels: { foo: 35 }})
bingo(transports)

expectType<bingo.Logger>(bingo({
    transport: {targets: [
            {
                level: 'info',
                target: '#bingo/pretty',
                options: { some: 'options for', the: 'transport' }
            },
            {
                level: 'trace',
                target: '#bingo-logger/file',
                options: { destination: './test.log' }
            }
        ], levels: { foo: 35 }
    },
}))

const transportsWithoutOptions = bingo.transport({
    targets: [
        { target: '#bingo/pretty' },
        { target: '#bingo-logger/file' }
    ], levels: { foo: 35 }
})
bingo(transports)

expectType<bingo.Logger>(bingo({
    transport: {
        targets: [
            { target: '#bingo/pretty' },
            { target: '#bingo-logger/file' }
        ], levels: { foo: 35 }
    },
}))

const pipelineTransport = bingo.transport({
    pipeline: [{
        target: './my-transform.js'
    }, {
        // Use target: 'bingo-logger/file' to write to stdout
        // without any change.
        target: 'bingo-pretty'
    }]
})
bingo(pipelineTransport)

expectType<bingo.Logger>(bingo({
    transport: {
        pipeline: [{
            target: './my-transform.js'
        }, {
            // Use target: 'bingo-logger/file' to write to stdout
            // without any change.
            target: 'bingo-pretty'
        }]
    }
}))

type TransportConfig = {
    id: string
}

// Custom transport params
const customTransport = bingo.transport<TransportConfig>({
    target: 'custom',
    options: { id: 'abc' }
})
bingo(customTransport)

// Worker
bingo.transport({
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
bingo.transport({
    targets: [],
    dedupe: true,
})
