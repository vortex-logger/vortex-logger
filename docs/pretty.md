# Pretty Printing

By default, Bingo log lines are newline delimited JSON (NDJSON). This is perfect
for production usage and long-term storage. It's not so great for development
environments. Thus, Bingo logs can be prettified by using a Bingo prettifier
module like [`pino-pretty`][pp]:

1. Install a prettifier module as a separate dependency, e.g. `npm install pino-pretty`.
2. Instantiate the logger with the `transport.target` option set to `'pino-pretty'`:
  ```js
  const bingo = require('bingo')
  const logger = bingo({
    transport: {
      target: 'pino-pretty'
    },
  })

  logger.info('hi')
  ```
3. The transport option can also have an options object containing `pino-pretty` options:
  ```js
  const bingo = require('bingo')
  const logger = bingo({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })

  logger.info('hi')
  ```

  [pp]: https://github.com/pinojs/pino-pretty
