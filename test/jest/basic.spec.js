/* global test */
const bingo = require('../../bingo')

test('transport should work in jest', function () {
  bingo({
    transport: {
      target: 'bingo-pretty'
    }
  })
})
