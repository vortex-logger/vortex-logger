'use strict'

const { test } = require('tap')
const bingo = require('../')

const descLevels = {
  trace: 60,
  debug: 50,
  info: 40,
  warn: 30,
  error: 20,
  fatal: 10
}

const ascLevels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}

test('Default levels suite', ({ test, end }) => {
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

  test('ASC: can check if child has current level enabled', async ({ equal }) => {
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

  end()
})

test('Ascending levels suite', ({ test, end }) => {
  const customLevels = ascLevels
  const levelComparison = 'ASC'

  test('can check if current level enabled', async ({ equal }) => {
    const log = bingo({ level: 'debug', levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(true, log.isLevelEnabled('debug'))
  })

  test('can check if level enabled after level set', async ({ equal }) => {
    const log = bingo({ levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(false, log.isLevelEnabled('debug'))
    log.level = 'debug'
    equal(true, log.isLevelEnabled('debug'))
  })

  test('can check if higher level enabled', async ({ equal }) => {
    const log = bingo({ level: 'debug', levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(true, log.isLevelEnabled('error'))
  })

  test('can check if lower level is disabled', async ({ equal }) => {
    const log = bingo({ level: 'error', customLevels, useOnlyCustomLevels: true })
    equal(false, log.isLevelEnabled('trace'))
  })

  test('can check if child has current level enabled', async ({ equal }) => {
    const log = bingo().child({ levelComparison, customLevels, useOnlyCustomLevels: true }, { level: 'debug' })
    equal(true, log.isLevelEnabled('debug'))
    equal(true, log.isLevelEnabled('error'))
    equal(false, log.isLevelEnabled('trace'))
  })

  test('can check if custom level is enabled', async ({ equal }) => {
    const log = bingo({
      levelComparison,
      useOnlyCustomLevels: true,
      customLevels: { foo: 35, ...customLevels },
      level: 'debug'
    })
    equal(true, log.isLevelEnabled('foo'))
    equal(true, log.isLevelEnabled('error'))
    equal(false, log.isLevelEnabled('trace'))
  })

  end()
})

test('Descending levels suite', ({ test, end }) => {
  const customLevels = descLevels
  const levelComparison = 'DESC'

  test('can check if current level enabled', async ({ equal }) => {
    const log = bingo({ level: 'debug', levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(true, log.isLevelEnabled('debug'))
  })

  test('can check if level enabled after level set', async ({ equal }) => {
    const log = bingo({ levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(false, log.isLevelEnabled('debug'))
    log.level = 'debug'
    equal(true, log.isLevelEnabled('debug'))
  })

  test('can check if higher level enabled', async ({ equal }) => {
    const log = bingo({ level: 'debug', levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(true, log.isLevelEnabled('error'))
  })

  test('can check if lower level is disabled', async ({ equal }) => {
    const log = bingo({ level: 'error', levelComparison, customLevels, useOnlyCustomLevels: true })
    equal(false, log.isLevelEnabled('trace'))
  })

  test('can check if child has current level enabled', async ({ equal }) => {
    const log = bingo({ levelComparison, customLevels, useOnlyCustomLevels: true }).child({}, { level: 'debug' })
    equal(true, log.isLevelEnabled('debug'))
    equal(true, log.isLevelEnabled('error'))
    equal(false, log.isLevelEnabled('trace'))
  })

  test('can check if custom level is enabled', async ({ equal }) => {
    const log = bingo({
      levelComparison,
      customLevels: { foo: 35, ...customLevels },
      useOnlyCustomLevels: true,
      level: 'debug'
    })
    equal(true, log.isLevelEnabled('foo'))
    equal(true, log.isLevelEnabled('error'))
    equal(false, log.isLevelEnabled('trace'))
  })

  end()
})

test('Custom levels comparison', async ({ test, end }) => {
  test('Custom comparison returns true cause level is enabled', async ({ equal }) => {
    const log = bingo({ level: 'error', levelComparison: () => true })
    equal(true, log.isLevelEnabled('debug'))
  })

  test('Custom comparison returns false cause level is disabled', async ({ equal }) => {
    const log = bingo({ level: 'error', levelComparison: () => false })
    equal(false, log.isLevelEnabled('debug'))
  })

  test('Custom comparison returns true cause child level is enabled', async ({ equal }) => {
    const log = bingo({ levelComparison: () => true }).child({ level: 'error' })
    equal(true, log.isLevelEnabled('debug'))
  })

  test('Custom comparison returns false cause child level is disabled', async ({ equal }) => {
    const log = bingo({ levelComparison: () => false }).child({ level: 'error' })
    equal(false, log.isLevelEnabled('debug'))
  })

  end()
})
