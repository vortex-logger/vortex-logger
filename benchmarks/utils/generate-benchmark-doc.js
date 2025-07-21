'use strict'
const { join } = require('node:path')
const { execSync } = require('node:child_process')

const run = (type) => {
  process.stderr.write(`benchmarking ${type}\n`)
  return execSync(`node ${join(__dirname, 'runbench')} ${type} -q`)
}

console.log(`
# Benchmarks

\`bingo.info('hello world')\`:

\`\`\`
${run('basic')}
\`\`\`

\`bingo.info({'hello': 'world'})\`:

\`\`\`
${run('object')}
\`\`\`

\`bingo.info(aBigDeeplyNestedObject)\`:

\`\`\`
${run('deep-object')}
\`\`\`

\`bingo.info('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})\`:

For a fair comparison, [LogLevel](http://npm.im/loglevel) was extended
to include a timestamp and [bole](http://npm.im/bole) had
\`fastTime\` mode switched on.
`)
