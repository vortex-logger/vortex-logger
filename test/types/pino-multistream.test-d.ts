import { expectType } from 'tsd'

import { createWriteStream } from 'node:fs'

import bingo, { multistream } from '../../bingo-logger'

const streams = [
  { stream: process.stdout },
  { stream: createWriteStream('') },
  { level: 'error' as const, stream: process.stderr },
  { level: 'fatal' as const, stream: process.stderr },
]

expectType<bingo.MultiStreamRes>(bingo.multistream(process.stdout))
expectType<bingo.MultiStreamRes>(bingo.multistream([createWriteStream('')]))
expectType<bingo.MultiStreamRes<'error'>>(bingo.multistream({ level: 'error' as const, stream: process.stderr }))
expectType<bingo.MultiStreamRes<'fatal'>>(bingo.multistream([{ level: 'fatal' as const, stream: createWriteStream('') }]))

expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(bingo.multistream(streams))
expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(bingo.multistream(streams, {}))
expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(bingo.multistream(streams, { levels: { 'info': 30 } }))
expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(bingo.multistream(streams, { dedupe: true }))
expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(bingo.multistream(streams[0]).add(streams[1]))
expectType<bingo.MultiStreamRes<'error' | 'fatal'>>(multistream(streams))
expectType<bingo.MultiStreamRes<'error'>>(multistream(streams).clone('error'))


expectType<bingo.MultiStreamRes>(multistream(process.stdout));
