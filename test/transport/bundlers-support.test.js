'use strict'

const os = require('os')
const { join } = require('path')
const { readFile } = require('fs').promises
const { watchFileCreated, file } = require('../helper')
const { test } = require('tap')
const bingo = require('../../bingo')

const { pid } = process
const hostname = os.hostname()

test('bingo.transport with destination overriden by bundler', async ({ same, teardown }) => {
  globalThis.__bundlerPathsOverrides = {
    foobar: join(__dirname, '..', 'fixtures', 'to-file-transport.js')
  }

  const destination = file()
  const transport = bingo.transport({
    target: 'foobar',
    options: { destination }
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

test('bingo.transport with worker destination overriden by bundler', async ({ same, teardown }) => {
  globalThis.__bundlerPathsOverrides = {
    'bingo-worker': join(__dirname, '..', '..', 'lib/worker.js')
  }

  const destination = file()
  const transport = bingo.transport({
    targets: [
      {
        target: join(__dirname, '..', 'fixtures', 'to-file-transport.js'),
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

test('bingo.transport with worker-pipeline destination overriden by bundler', async ({ same, teardown }) => {
  globalThis.__bundlerPathsOverrides = {
    'bingo-pipeline-worker': join(__dirname, '..', '..', 'lib/worker-pipeline.js')
  }

  const destination = file()
  const transport = bingo.transport({
    pipeline: [
      {
        target: join(__dirname, '..', 'fixtures', 'to-file-transport.js'),
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
