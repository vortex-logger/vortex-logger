'use strict'

const bench = require('fastbench')
const bingo = require('../../')

const base = bingo(bingo.destination('/dev/null'))
const child = base.child({})
const childChild = child.child({})
const childChildChild = childChild.child({})
const childChildChildChild = childChildChild.child({})
const child2 = base.child({})
const baseSerializers = bingo(bingo.destination('/dev/null'))
const baseSerializersChild = baseSerializers.child({})
const baseSerializersChildSerializers = baseSerializers.child({})

const max = 100

const run = bench([
  function benchBingoBase (cb) {
    for (var i = 0; i < max; i++) {
      base.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChild (cb) {
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildChild (cb) {
    for (var i = 0; i < max; i++) {
      childChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildChildChild (cb) {
    for (var i = 0; i < max; i++) {
      childChildChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildChildChildChild (cb) {
    for (var i = 0; i < max; i++) {
      childChildChildChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChild2 (cb) {
    for (var i = 0; i < max; i++) {
      child2.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoBaseSerializers (cb) {
    for (var i = 0; i < max; i++) {
      baseSerializers.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoBaseSerializersChild (cb) {
    for (var i = 0; i < max; i++) {
      baseSerializersChild.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoBaseSerializersChildSerializers (cb) {
    for (var i = 0; i < max; i++) {
      baseSerializersChildSerializers.info({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
