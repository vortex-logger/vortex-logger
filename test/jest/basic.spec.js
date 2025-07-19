/* global test */
const bingo = require('../../bingo-logger')

test('transport should work in jest', function () {
  bingo({
    transport: {
      target: 'pino-pretty'
    }
  })
})
