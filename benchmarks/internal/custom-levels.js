'use strict'

const bench = require('fastbench')
const bingo = require('../../')

const base = bingo(bingo.destination('/dev/null'))
const baseCl = bingo({
  customLevels: { foo: 31 }
}, bingo.destination('/dev/null'))
const child = base.child({})
const childCl = base.child({
  customLevels: { foo: 31 }
})
const childOfBaseCl = baseCl.child({})

const max = 100

const run = bench([
  function benchBingoNoCustomLevel (cb) {
    for (var i = 0; i < max; i++) {
      base.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoCustomLevel (cb) {
    for (var i = 0; i < max; i++) {
      baseCl.foo({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchChildNoCustomLevel (cb) {
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildCustomLevel (cb) {
    for (var i = 0; i < max; i++) {
      childCl.foo({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildInheritedCustomLevel (cb) {
    for (var i = 0; i < max; i++) {
      childOfBaseCl.foo({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildCreation (cb) {
    const child = base.child({})
    for (var i = 0; i < max; i++) {
      child.info({ hello: 'world' })
    }
    setImmediate(cb)
  },
  function benchBingoChildCreationCustomLevel (cb) {
    const child = base.child({
      customLevels: { foo: 31 }
    })
    for (var i = 0; i < max; i++) {
      child.foo({ hello: 'world' })
    }
    setImmediate(cb)
  }
], 10000)

run(run)
