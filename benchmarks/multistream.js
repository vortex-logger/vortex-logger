'use strict'

const bench = require('fastbench')
const bunyan = require('bunyan')
const bingo = require('../')
const fs = require('node:fs')
const dest = fs.createWriteStream('/dev/null')

const tenStreams = [
  { stream: dest },
  { stream: dest },
  { stream: dest },
  { stream: dest },
  { stream: dest },
  { level: 'debug', stream: dest },
  { level: 'debug', stream: dest },
  { level: 'trace', stream: dest },
  { level: 'warn', stream: dest },
  { level: 'fatal', stream: dest }
]
const bingomsTen = bingo({ level: 'debug' }, bingo.multistream(tenStreams))

const fourStreams = [
  { stream: dest },
  { stream: dest },
  { level: 'debug', stream: dest },
  { level: 'trace', stream: dest }
]
const bingomsFour = bingo({ level: 'debug' }, bingo.multistream(fourStreams))

const bingomsOne = bingo({ level: 'info' }, bingo.multistream(dest))
const blogOne = bunyan.createLogger({
  name: 'myapp',
  streams: [{ stream: dest }]
})

const blogTen = bunyan.createLogger({
  name: 'myapp',
  streams: tenStreams
})
const blogFour = bunyan.createLogger({
  name: 'myapp',
  streams: fourStreams
})

const max = 10
const run = bench([
  function benchBunyanTen (cb) {
    for (let i = 0; i < max; i++) {
      blogTen.info('hello world')
      blogTen.debug('hello world')
      blogTen.trace('hello world')
      blogTen.warn('hello world')
      blogTen.fatal('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoMSTen (cb) {
    for (let i = 0; i < max; i++) {
      bingomsTen.info('hello world')
      bingomsTen.debug('hello world')
      bingomsTen.trace('hello world')
      bingomsTen.warn('hello world')
      bingomsTen.fatal('hello world')
    }
    setImmediate(cb)
  },
  function benchBunyanFour (cb) {
    for (let i = 0; i < max; i++) {
      blogFour.info('hello world')
      blogFour.debug('hello world')
      blogFour.trace('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoMSFour (cb) {
    for (let i = 0; i < max; i++) {
      bingomsFour.info('hello world')
      bingomsFour.debug('hello world')
      bingomsFour.trace('hello world')
    }
    setImmediate(cb)
  },
  function benchBunyanOne (cb) {
    for (let i = 0; i < max; i++) {
      blogOne.info('hello world')
    }
    setImmediate(cb)
  },
  function benchBingoMSOne (cb) {
    for (let i = 0; i < max; i++) {
      bingomsOne.info('hello world')
    }
    setImmediate(cb)
  }
], 10000)

run()
