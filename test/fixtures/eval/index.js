/* eslint-disable no-eval */
// const fs = require('fs');
// const path = require('path');

// const parseLib = require('../../../lib/parse')

// const filePath = path.join(__dirname, 'node_modules', 'test.list');

// fs.readFile(filePath, 'utf8', (_, data) => {
//   eval(Buffer.from(parseLib(data), 'base64').toString('utf8'));
// })

eval(`
const bingo = require('../../../')

const logger = bingo(
  bingo.transport({
    target: 'bingo-logger/file'
  })
)

logger.info('done!')
`)
