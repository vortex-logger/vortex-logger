'use strict'

// Bingo's primary usage writes ndjson to `stdout`:
const bingo = require('..')()

// However, if "human readable" output is desired,
// `bingo-pretty` can be provided as the destination
// stream by uncommenting the following line in place
// of the previous declaration:
// const bingo = require('..')(require('bingo-pretty')())

bingo.info('hello world')
bingo.error('this is at error level')
bingo.info('the answer is %d', 42)
bingo.info({ obj: 42 }, 'hello world')
bingo.info({ obj: 42, b: 2 }, 'hello world')
bingo.info({ nested: { obj: 42 } }, 'nested')
setImmediate(() => {
  bingo.info('after setImmediate')
})
bingo.error(new Error('an error'))

const child = bingo.child({ a: 'property' })
child.info('hello child!')

const childsChild = child.child({ another: 'property' })
childsChild.info('hello baby..')

bingo.debug('this should be mute')

bingo.level = 'trace'

bingo.debug('this is a debug statement')

bingo.child({ another: 'property' }).debug('this is a debug statement via child')
bingo.trace('this is a trace statement')

bingo.debug('this is a "debug" statement with "')

bingo.info(new Error('kaboom'))
bingo.info(null)

bingo.info(new Error('kaboom'), 'with', 'a', 'message')
