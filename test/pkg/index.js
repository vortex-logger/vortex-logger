'use strict'

const os = require('node:os')
const { join } = require('node:path')
const { readFile } = require('node:fs').promises
const { watchFileCreated, file } = require('../helper')
const { test } = require('tap')
const bingo = require('../../bingo-logger')

const { pid } = process
const hostname = os.hostname()

/**
 * This file is packaged using pkg in order to test if transport-stream.js works in that context
 */

test('bingo.transport with worker destination overridden by bundler and mjs transport', async ({ same, teardown }) => {
  globalThis.__bundlerPathsOverrides = {
    'bingo-worker': join(__dirname, '..', '..', 'lib/worker.js')
  }

  const destination = file()
  const transport = bingo.transport({
    targets: [
      {
        target: join(__dirname, '..', 'fixtures', 'ts', 'to-file-transport.es2017.cjs'),
        options: { destination }
      }
    ]
  })

  teardown(transport.end.bind(transport))
  const instance = bingo(transport)
  instance.info('hello')
  await watchFileCreated(destination)
  const result = JSON.parse(await readFile(destination))
  delete result.time
  same(result, {
    pid,
    hostname,
    level: 30,
    msg: 'hello'
  })

  globalThis.__bundlerPathsOverrides = undefined
})
