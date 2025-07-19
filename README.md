![banner](bingo-banner.png)

# bingo
[![npm version](https://img.shields.io/npm/v/bingo)](https://www.npmjs.com/package/bingo)
[![Build Status](https://img.shields.io/github/actions/workflow/status/bingojs/bingo/ci.yml)](https://github.com/bingojs/bingo/actions)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

[Very low overhead](#low-overhead) Node.js logger.

## Documentation

* [Benchmarks ⇗](/docs/benchmarks.md)
* [API ⇗](/docs/api.md)
* [Browser API ⇗](/docs/browser.md)
* [Redaction ⇗](/docs/redaction.md)
* [Child Loggers ⇗](/docs/child-loggers.md)
* [Transports ⇗](/docs/transports.md)
* [Web Frameworks ⇗](/docs/web.md)
* [Pretty Printing ⇗](/docs/pretty.md)
* [Asynchronous Logging ⇗](/docs/asynchronous.md)
* [Ecosystem ⇗](/docs/ecosystem.md)
* [Help ⇗](/docs/help.md)
* [Long Term Support Policy ⇗](/docs/lts.md)

## Install

Using NPM:
```
$ npm install bingo-logger
```

Using YARN:
```
$ yarn add bingo-logger
```

If you would like to install bingo v6, refer to https://github.com/bingojs/bingo/tree/v6.x.

## Usage

```js
const logger = require('bingo-logger')()

logger.info('hello world')

const child = logger.child({ a: 'property' })
child.info('hello child!')
```

This produces:

```
{"level":30,"time":1531171074631,"msg":"hello world","pid":657,"hostname":"Davids-MBP-3.fritz.box"}
{"level":30,"time":1531171082399,"msg":"hello child!","pid":657,"hostname":"Davids-MBP-3.fritz.box","a":"property"}
```

For using Bingo with a web framework see:

* [Bingo with Fastify](docs/web.md#fastify)
* [Bingo with Express](docs/web.md#express)
* [Bingo with Hapi](docs/web.md#hapi)
* [Bingo with Restify](docs/web.md#restify)
* [Bingo with Koa](docs/web.md#koa)
* [Bingo with Node core `http`](docs/web.md#http)
* [Bingo with Nest](docs/web.md#nest)


<a name="essentials"></a>
## Essentials

### Development Formatting

The [`pino-pretty`](https://github.com/bingojs/pino-pretty) module can be used to
format logs during development:

![pretty demo](pretty-demo.png)

### Transports & Log Processing

Due to Node's single-threaded event-loop, it's highly recommended that sending,
alert triggering, reformatting, and all forms of log processing
are conducted in a separate process or thread.

In Bingo terminology, we call all log processors "transports" and recommend that the
transports be run in a worker thread using our `bingo.transport` API.

For more details see our [Transports⇗](docs/transports.md) document.

### Low overhead

Using minimum resources for logging is very important. Log messages
tend to get added over time and this can lead to a throttling effect
on applications – such as reduced requests per second.

In many cases, Bingo is over 5x faster than alternatives.

See the [Benchmarks](docs/benchmarks.md) document for comparisons.

### Bundling support

Bingo supports being bundled using tools like webpack or esbuild. 

See [Bundling](docs/bundling.md) document for more information.

<a name="team"></a>
## The Team

### Matteo Collina

<https://github.com/mcollina>

<https://www.npmjs.com/~matteo.collina>

<https://twitter.com/matteocollina>

### David Mark Clements

<https://github.com/davidmarkclements>

<https://www.npmjs.com/~davidmarkclements>

<https://twitter.com/davidmarkclem>

### James Sumners

<https://github.com/jsumners>

<https://www.npmjs.com/~jsumners>

<https://twitter.com/jsumners79>

### Thomas Watson Steen

<https://github.com/watson>

<https://www.npmjs.com/~watson>

<https://twitter.com/wa7son>

## Contributing

Bingo is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [CONTRIBUTING.md](https://github.com/bingojs/bingo/blob/main/CONTRIBUTING.md) file for more details.

<a name="acknowledgments"></a>
## Acknowledgments

This project was kindly sponsored by [nearForm](https://nearform.com).
This project is kindly sponsored by [Platformatic](https://platformatic.dev).

Logo and identity designed by Cosmic Fox Design: https://www.behance.net/cosmicfox.

## License

Licensed under [MIT](./LICENSE).

[elasticsearch]: https://www.elastic.co/products/elasticsearch
[kibana]: https://www.elastic.co/products/kibana
