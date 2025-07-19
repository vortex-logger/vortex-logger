'use strict'

const { test } = require('tap')
const bingo = require('../')

test('can check if current level enabled', async ({ equal }) => {
  const log = bingo({ level: 'debug' })
  equal(true, log.isLevelEnabled('debug'))
})

test('can check if level enabled after level set', async ({ equal }) => {
  const log = bingo()
  equal(false, log.isLevelEnabled('debug'))
  log.level = 'debug'
  equal(true, log.isLevelEnabled('debug'))
})

test('can check if higher level enabled', async ({ equal }) => {
  const log = bingo({ level: 'debug' })
  equal(true, log.isLevelEnabled('error'))
})

test('can check if lower level is disabled', async ({ equal }) => {
  const log = bingo({ level: 'error' })
  equal(false, log.isLevelEnabled('trace'))
})

test('can check if child has current level enabled', async ({ equal }) => {
  const log = bingo().child({}, { level: 'debug' })
  equal(true, log.isLevelEnabled('debug'))
  equal(true, log.isLevelEnabled('error'))
  equal(false, log.isLevelEnabled('trace'))
})

test('can check if custom level is enabled', async ({ equal }) => {
  const log = bingo({
    customLevels: { foo: 35 },
    level: 'debug'
  })
  equal(true, log.isLevelEnabled('foo'))
  equal(true, log.isLevelEnabled('error'))
  equal(false, log.isLevelEnabled('trace'))
})
