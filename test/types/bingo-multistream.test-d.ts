import { expectType } from 'tsd'

import { createWriteStream } from 'node:fs'

import zenlog, { multistream } from '../../zenlog'

const streams = [
  { stream: process.stdout },
  { stream: createWriteStream('') },
  { level: 'error' as const, stream: process.stderr },
  { level: 'fatal' as const, stream: process.stderr },
]

expectType<zenlog.MultiStreamRes>(zenlog.multistream(process.stdout))
expectType<zenlog.MultiStreamRes>(zenlog.multistream([createWriteStream('')]))
expectType<zenlog.MultiStreamRes<'error'>>(zenlog.multistream({ level: 'error' as const, stream: process.stderr }))
expectType<zenlog.MultiStreamRes<'fatal'>>(zenlog.multistream([{ level: 'fatal' as const, stream: createWriteStream('') }]))

expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(zenlog.multistream(streams))
expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(zenlog.multistream(streams, {}))
expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(zenlog.multistream(streams, { levels: { 'info': 30 } }))
expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(zenlog.multistream(streams, { dedupe: true }))
expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(zenlog.multistream(streams[0]).add(streams[1]))
expectType<zenlog.MultiStreamRes<'error' | 'fatal'>>(multistream(streams))
expectType<zenlog.MultiStreamRes<'error'>>(multistream(streams).clone('error'))


expectType<zenlog.MultiStreamRes>(multistream(process.stdout));
