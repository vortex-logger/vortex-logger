'use strict'

const bench = require('fastbench')
const bingo = require('../../bingo-logger')
const fs = require('node:fs')
const dest = fs.createWriteStream('/dev/null')
const plog = bingo(dest)
delete require.cache[require.resolve('../../')]
const plogDest = require('../../bingo-logger')(bingo.destination('/dev/null'))
delete require.cache[require.resolve('../../')]
const plogAsync = require('../../bingo-logger')(bingo.destination({ dest: '/dev/null', sync: false }))
const plogChild = plog.child({ a: 'property' })
const plogDestChild = plogDest.child({ a: 'property' })
const plogAsyncChild = plogAsync.child({ a: 'property' })
const plogChildChild = plog.child({ a: 'property' }).child({ sub: 'child' })
const plogDestChildChild = plogDest.child({ a: 'property' }).child({ sub: 'child' })
const plogAsyncChildChild = plogAsync.child({ a: 'property' }).child({ sub: 'child' })

const max = 10

const run = bench([
  function benchBingo (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoDest (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoExtreme (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoObj (cb) {
    for (var i = 0; i < max; i++) {
      plog.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoDestObj (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncObj (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChild (cb) {
    for (var i = 0; i < max; i++) {
      plogChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoDestChild (cb) {
    for (var i = 0; i < max; i++) {
      plogDestChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncChild (cb) {
    for (var i = 0; i < max; i++) {
      plogAsyncChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildChild (cb) {
    for (var i = 0; i < max; i++) {
      plogChildChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoDestChildChild (cb) {
    for (var i = 0; i < max; i++) {
      plogDestChildChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncChildChild (cb) {
    for (var i = 0; i < max; i++) {
      plogAsyncChildChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildCreation (cb) {
    const child = plog.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoDestChildCreation (cb) {
    const child = plogDest.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoMulti (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoDestMulti (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoAsyncMulti (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info('hello', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoInterpolate (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello %s', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoDestInterpolate (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello %s', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoDestInterpolate (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello %s', 'world')
    }
    setImmediate(cb)
  },
  function benchBingoInterpolateAll (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello %s %j %d', 'world', { obj: true }, 4)
    }
    setImmediate(cb)
  },
  function benchBingoDestInterpolateAll (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello %s %j %d', 'world', { obj: true }, 4)
    }
    setImmediate(cb)
  },
  function benchBingoAsyncInterpolateAll (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info('hello %s %j %d', 'world', { obj: true }, 4)
    }
    setImmediate(cb)
  },
  function benchBingoInterpolateExtra (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    }
    setImmediate(cb)
  },
  function benchBingoDestInterpolateExtra (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    }
    setImmediate(cb)
  },
  function benchBingoAsyncInterpolateExtra (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
