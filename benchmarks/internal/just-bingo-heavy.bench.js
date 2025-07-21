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
const deep = require('../../package.json')
deep.deep = JSON.parse(JSON.stringify(deep))
deep.deep.deep = JSON.parse(JSON.stringify(deep))
const longStr = JSON.stringify(deep)

const max = 10

const run = bench([
  function benchBingoLongString (cb) {
    for (var i = 0; i < max; i++) {
      plog.info(longStr)
    }
    setImmediate(cb)
  },
  function benchBingoDestLongString (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info(longStr)
    }
    setImmediate(cb)
  },
  function benchBingoAsyncLongString (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info(longStr)
    }
    setImmediate(cb)
  },
  function benchBingoDeepObj (cb) {
    for (var i = 0; i < max; i++) {
      plog.info(deep)
    }
    setImmediate(cb)
  },
  function benchBingoDestDeepObj (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info(deep)
    }
    setImmediate(cb)
  },
  function benchBingoAsyncDeepObj (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info(deep)
    }
    setImmediate(cb)
  },
  function benchBingoInterpolateDeep (cb) {
    for (var i = 0; i < max; i++) {
      plog.info('hello %j', deep)
    }
    setImmediate(cb)
  },
  function benchBingoDestInterpolateDeep (cb) {
    for (var i = 0; i < max; i++) {
      plogDest.info('hello %j', deep)
    }
    setImmediate(cb)
  },
  function benchBingoAsyncInterpolateDeep (cb) {
    for (var i = 0; i < max; i++) {
      plogAsync.info('hello %j', deep)
    }
    setImmediate(cb)
  }
], 1000)

run(run)
