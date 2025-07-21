'use strict'

const bench = require('fastbench')
const bingo = require('../../')
const fs = require('node:fs')
const dest = fs.createWriteStream('/dev/null')
const plog = bingo(dest)
delete require.cache[require.resolve('../../')]
const plogAsync = require('../../')(bingo.destination({ dest: '/dev/null', sync: false }))
delete require.cache[require.resolve('../../')]
const plogUnsafe = require('../../')({ safe: false }, dest)
delete require.cache[require.resolve('../../')]
const plogUnsafeAsync = require('../../')(
  { safe: false },
  bingo.destination({ dest: '/dev/null', sync: false })
)
const plogRedact = bingo({ redact: ['a.b.c'] }, dest)
delete require.cache[require.resolve('../../')]
const plogAsyncRedact = require('../../')(
  { redact: ['a.b.c'] },
  bingo.destination({ dest: '/dev/null', sync: false })
)
delete require.cache[require.resolve('../../')]
const plogUnsafeRedact = require('../../')({ redact: ['a.b.c'], safe: false }, dest)
delete require.cache[require.resolve('../../')]
const plogUnsafeAsyncRedact = require('../../')(
  { redact: ['a.b.c'], safe: false },
  bingo.destination({ dest: '/dev/null', sync: false })
)

const max = 10

// note that "redact me." is the same amount of bytes as the censor: "[Redacted]"

const run = bench([
  function benchBingoNoRedact (cb) {
    for (var i = 0; i < max; i++) {
      plog.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoUnsafeNoRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafe.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoUnsafeRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafeRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncNoRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogAsyncRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoUnsafeAsyncNoRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafeAsync.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  },
  function benchBingoUnsafeAsyncRedact (cb) {
    for (var i = 0; i < max; i++) {
      plogUnsafeAsyncRedact.info({ a: { b: { c: 'redact me.', d: 'leave me' } } })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
