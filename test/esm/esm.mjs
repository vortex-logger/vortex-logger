import t from 'tap'
import bingo from '../../bingo-logger.js'
import helper from '../helper.js'

const { sink, check, once } = helper

t.test('esm support', async ({ equal }) => {
  const stream = sink()
  const instance = bingo(stream)
  instance.info('hello world')
  check(equal, await once(stream, 'data'), 30, 'hello world')
})
