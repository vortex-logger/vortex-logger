'use strict'

const { test } = require('tap')
const { join } = require('node:path')
const { fork } = require('node:child_process')
const { once } = require('./helper')
const writer = require('flush-write-stream')
const bingo = require('..')

test('do not use SonicBoom is someone tampered with process.stdout.write', async ({ not }) => {
  let actual = ''
  const child = fork(join(__dirname, 'fixtures', 'stdout-hack-protection.js'), { silent: true })

  child.stdout.pipe(writer((s, enc, cb) => {
    actual += s
    cb()
  }))
  await once(child, 'close')
  not(actual.match(/^hack/), null)
})

test('do not use SonicBoom is someone has passed process.stdout to bingo', async ({ equal }) => {
  const logger = bingo(process.stdout)
  equal(logger[bingo.symbols.streamSym], process.stdout)
})

test('do not crash if process.stdout has no fd', async ({ teardown }) => {
  const fd = process.stdout.fd
  delete process.stdout.fd
  teardown(function () { process.stdout.fd = fd })
  bingo()
})

test('use fd=1 if process.stdout has no fd in bingo.destination() (worker case)', async ({ teardown }) => {
  const fd = process.stdout.fd
  delete process.stdout.fd
  teardown(function () { process.stdout.fd = fd })
  bingo.destination()
})
