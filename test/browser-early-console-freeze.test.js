'use strict'
Object.freeze(console)
const test = require('tape')
const bingo = require('../browser')

test('silent level', ({ end, fail, pass }) => {
  bingo({
    level: 'silent',
    browser: { }
  })
  end()
})
