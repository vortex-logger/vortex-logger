'use strict'

const bench = require('fastbench')
const bingo = require('../')
const bunyan = require('bunyan')
const bole = require('bole')('bench')
const fs = require('node:fs')
const dest = fs.createWriteStream('/dev/null')
const plogNodeStream = bingo(dest)
const plogDest = bingo(bingo.destination(('/dev/null')))
delete require.cache[require.resolve('../')]
const plogMinLength = require('../')(bingo.destination({ dest: '/dev/null', sync: false, minLength: 4096 }))

const max = 10
const blog = bunyan.createLogger({
  name: 'myapp',
  streams: [{
    level: 'trace',
    stream: dest
  }]
})

require('bole').output({
  level: 'info',
  stream: dest
}).setFastTime(true)

const run = bench([
  function benchBunyanCreation (cb) {
    const child = blog.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBoleCreation (cb) {
    const child = bole('child')
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoCreation (cb) {
    const child = plogDest.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoMinLengthCreation (cb) {
    const child = plogMinLength.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoNodeStreamCreation (cb) {
    const child = plogNodeStream.child({ a: 'property' })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoCreationWithOption (cb) {
    const child = plogDest.child({ a: 'property' }, { redact: [] })
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
