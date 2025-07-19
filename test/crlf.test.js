'use strict'

const { test } = require('tap')
const writer = require('flush-write-stream')
const bingo = require('../')

function capture () {
  const ws = writer((chunk, enc, cb) => {
    ws.data += chunk.toString()
    cb()
  })
  ws.data = ''
  return ws
}

test('bingo uses LF by default', async ({ ok }) => {
  const stream = capture()
  const logger = bingo(stream)
  logger.info('foo')
  logger.error('bar')
  ok(/foo[^\r\n]+\n[^\r\n]+bar[^\r\n]+\n/.test(stream.data))
})

test('bingo can log CRLF', async ({ ok }) => {
  const stream = capture()
  const logger = bingo({
    crlf: true
  }, stream)
  logger.info('foo')
  logger.error('bar')
  ok(/foo[^\n]+\r\n[^\n]+bar[^\n]+\r\n/.test(stream.data))
})
