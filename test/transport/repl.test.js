'use strict'

const { doesNotThrow, test } = require('tap')
const proxyquire = require('proxyquire')

test('bingo.transport resolves targets in REPL', async ({ same }) => {
  // Arrange
  const transport = proxyquire('../../lib/transport', {
    './caller': () => ['node:repl']
  })

  // Act / Assert
  doesNotThrow(() => transport({ target: 'bingo-pretty' }))
})
