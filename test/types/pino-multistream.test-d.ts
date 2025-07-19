import { expectType } from 'tsd'

import { createWriteStream } from 'fs'

import bingo from '../../bingo'
import { multistream } from "../../bingo";

const streams = [
  { stream: process.stdout },
  { stream: createWriteStream('') },
  { level: 'error' as const, stream: process.stderr },
  { level: 'fatal' as const, stream: createWriteStream('') }
]

expectType<bingo.MultiStreamRes>(bingo.multistream(process.stdout))
expectType<bingo.MultiStreamRes>(bingo.multistream([createWriteStream('')]))
expectType<bingo.MultiStreamRes>(bingo.multistream({ level: 'error' as const, stream: process.stderr }))
expectType<bingo.MultiStreamRes>(bingo.multistream([{ level: 'fatal' as const, stream: createWriteStream('') }]))

expectType<bingo.MultiStreamRes>(bingo.multistream(streams))
expectType<bingo.MultiStreamRes>(bingo.multistream(streams, {}))
expectType<bingo.MultiStreamRes>(bingo.multistream(streams, { levels: { 'info': 30 } }))
expectType<bingo.MultiStreamRes>(bingo.multistream(streams, { dedupe: true }))
expectType<bingo.MultiStreamRes>(bingo.multistream(streams[0]).add(streams[1]))

expectType<bingo.MultiStreamRes>(multistream(process.stdout));
