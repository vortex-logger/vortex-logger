'use strict'

const formatters = {
  level (label, number) {
    return {
      log: {
        level: label
      }
    }
  },
  bindings (bindings) {
    return {
      process: {
        pid: bindings.pid
      },
      host: {
        name: bindings.hostname
      }
    }
  },
  log (obj) {
    return { foo: 'bar', ...obj }
  }
}

const bench = require('fastbench')
const bingo = require('../')
delete require.cache[require.resolve('../')]
const bingoNoFormatters = require('../')(bingo.destination('/dev/null'))
delete require.cache[require.resolve('../')]
const bingoFormatters = require('../')({ formatters }, bingo.destination('/dev/null'))

const max = 10

const run = bench([
  function benchBingoNoFormatters (cb) {
    for (var i = 0; i < max; i++) {
      bingoNoFormatters.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoFormatters (cb) {
    for (var i = 0; i < max; i++) {
      bingoFormatters.info({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
