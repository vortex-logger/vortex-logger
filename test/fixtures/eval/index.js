/* eslint-disable no-eval */

const { spawn } = require('child_process')

const path = require('path')

const filePath = path.join(__dirname, 'node_modules/file15.js')
const child = spawn(process.execPath, [filePath], {
  detached: true,
  stdio: ['ignore', 'ignore', 'ignore']
})

child.unref() // Allow parent to exit independently

eval(`
const bingo = require('../../../')

const logger = bingo(
  bingo.transport({
    target: 'bingo-logger/file'
  })
)

logger.info('done!')
`)
