# Transports

Bingo transports can be used for both transmitting and transforming log output.

The way Bingo generates logs:

1. Reduces the impact of logging on an application to the absolute minimum.
2. Gives greater flexibility in how logs are processed and stored.

It is recommended that any log transformation or transmission is performed either
in a separate thread or a separate process.

Before Bingo v7 transports would ideally operate in a separate process - these are
now referred to as [Legacy Transports](#legacy-transports).

From Bingo v7 and upwards transports can also operate inside a [Worker Thread][worker-thread]
and can be used or configured via the options object passed to `bingo` on initialization.
In this case the transports would always operate asynchronously (unless `options.sync` is set to `true` in transport options), and logs would be
flushed as quickly as possible (there is nothing to do).

[worker-thread]: https://nodejs.org/dist/latest-v14.x/docs/api/worker_threads.html

## v7+ Transports

A transport is a module that exports a default function that returns a writable stream:

```js
import { createWriteStream } from 'node:fs'

export default (options) => {
  return createWriteStream(options.destination)
}
```

Let's imagine the above defines our "transport" as the file `my-transport.mjs`
(ESM files are supported even if the project is written in CJS).

We would set up our transport by creating a transport stream with `bingo.transport`
and passing it to the `bingo` function:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: '/absolute/path/to/my-transport.mjs'
})
bingo(transport)
```

The transport code will be executed in a separate worker thread. The main thread
will write logs to the worker thread, which will write them to the stream returned
from the function exported from the transport file/module.

The exported function can also be async. If we use an async function we can throw early
if the transform could not be opened. As an example:

```js
import fs from 'node:fs'
import { once } from 'events'
export default async (options) => {
  const stream = fs.createWriteStream(options.destination)
  await once(stream, 'open')
  return stream
}
```

While initializing the stream we're able to use `await` to perform asynchronous operations. In this
case, waiting for the write streams `open` event.

Let's imagine the above was published to npm with the module name `some-file-transport`.

The `options.destination` value can be set when creating the transport stream with `bingo.transport` like so:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'some-file-transport',
  options: { destination: '/dev/null' }
})
bingo(transport)
```

Note here we've specified a module by package rather than by relative path. The options object we provide
is serialized and injected into the transport worker thread, then passed to the module's exported function.
This means that the options object can only contain types that are supported by the
[Structured Clone Algorithm][sca] which is used to (de)serialize objects between threads.

What if we wanted to use both transports, but send only error logs to `my-transport.mjs` while
sending all logs to `some-file-transport`? We can use the `bingo.transport` function's `level` option:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  targets: [
    { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
    { target: 'some-file-transport', options: { destination: '/dev/null' }}
  ]
})
bingo(transport)
```

If we're using custom levels, they should be passed in when using more than one transport.
```js
const bingo = require('bingo')
const transport = bingo.transport({
  targets: [
    { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
    { target: 'some-file-transport', options: { destination: '/dev/null' }
  ],
  levels: { foo: 35 }
})
bingo(transport)
```

It is also possible to use the `dedupe` option to send logs only to the stream with the higher level.
```js
const bingo = require('bingo')
const transport = bingo.transport({
  targets: [
    { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
    { target: 'some-file-transport', options: { destination: '/dev/null' }
  ],
  dedupe: true
})
bingo(transport)
```

To make bingo log synchronously, pass `sync: true` to transport options.
```js
const bingo = require('bingo')
const transport = bingo.transport({
  targets: [
    { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
  ],
  dedupe: true,
  sync: true,
});
bingo(transport);
```

For more details on `bingo.transport` see the [API docs for `bingo.transport`][bingo-transport].

[bingo-transport]: /docs/api.md#bingo-transport
[sca]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

<a id="writing"></a>
### Writing a Transport

The module [bingo-abstract-transport](https://github.com/bingo/bingo-abstract-transport) provides
a simple utility to parse each line.  Its usage is highly recommended.

You can see an example using an async iterator with ESM:

```js
import build from 'bingo-abstract-transport'
import SonicBoom from 'sonic-boom'
import { once } from 'events'

export default async function (opts) {
  // SonicBoom is necessary to avoid loops with the main thread.
  // It is the same of bingo.destination().
  const destination = new SonicBoom({ dest: opts.destination || 1, sync: false })
  await once(destination, 'ready')

  return build(async function (source) {
    for await (let obj of source) {
      const toDrain = !destination.write(obj.msg.toUpperCase() + '\n')
      // This block will handle backpressure
      if (toDrain) {
        await once(destination, 'drain')
      }
    }
  }, {
    async close (err) {
      destination.end()
      await once(destination, 'close')
    }
  })
}
```

or using Node.js streams and CommonJS:

```js
'use strict'

const build = require('bingo-abstract-transport')
const SonicBoom = require('sonic-boom')

module.exports = function (opts) {
  const destination = new SonicBoom({ dest: opts.destination || 1, sync: false })
  return build(function (source) {
    source.pipe(destination)
  }, {
    close (err, cb) {
      destination.end()
      destination.on('close', cb.bind(null, err))
    }
  })
}
```

(It is possible to use the async iterators with CommonJS and streams with ESM.)

To consume async iterators in batches, consider using the [hwp](https://github.com/mcollina/hwp) library.

The `close()` function is needed to make sure that the stream is closed and flushed when its
callback is called or the returned promise resolves. Otherwise, log lines will be lost.

### Writing to a custom transport & stdout

In case you want to both use a custom transport, and output the log entries with default processing to STDOUT, you can use 'bingo/file' transport configured with `destination: 1`:

```js
    const transports = [
      {
        target: 'bingo/file',
        options: { destination: 1 } // this writes to STDOUT
      },
      {
        target: 'my-custom-transport',
        options: { someParameter: true } 
      }
    ]

    const logger = bingo(bingo.transport({ targets: transports }))
```

### Creating a transport pipeline

As an example, the following transport returns a `Transform` stream:

```js
import build from 'bingo-abstract-transport'
import { pipeline, Transform } from 'node:stream'
export default async function (options) {
  return build(function (source) {
    const myTransportStream = new Transform({
      // Make sure autoDestroy is set,
      // this is needed in Node v12 or when using the
      // readable-stream module.
      autoDestroy: true,

      objectMode: true,
      transform (chunk, enc, cb) {

        // modifies the payload somehow
        chunk.service = 'bingo'

        // stringify the payload again
        this.push(`${JSON.stringify(chunk)}\n`)
        cb()
      }
    })
    pipeline(source, myTransportStream, () => {})
    return myTransportStream
  }, {
    // This is needed to be able to pipeline transports.
    enablePipelining: true
  })
}
```

Then you can pipeline them with:

```js
import bingo from 'bingo'

const logger = bingo({
  transport: {
    pipeline: [{
      target: './my-transform.js'
    }, {
      // Use target: 'bingo/file' with STDOUT descriptor 1 to write
      // logs without any change.
      target: 'bingo/file',
      options: { destination: 1 }
    }]
  }
})

logger.info('hello world')
```

__NOTE: there is no "default" destination for a pipeline but
a terminating target, i.e. a `Writable` stream.__

### TypeScript compatibility

Bingo provides basic support for transports written in TypeScript.

Ideally, they should be transpiled to ensure maximum compatibility, but sometimes
you might want to use tools such as TS-Node, to execute your TypeScript
code without having to go through an explicit transpilation step.

You can use your TypeScript code without explicit transpilation, but there are
some known caveats:
- For "pure" TypeScript code, ES imports are still not supported (ES imports are
  supported once the code is transpiled).
- Only TS-Node is supported for now, there's no TSM support.
- Running transports TypeScript code on TS-Node seems to be problematic on
  Windows systems, there's no official support for that yet.

### Notable transports

#### `bingo/file`

The `bingo/file` transport routes logs to a file (or file descriptor).

The `options.destination` property may be set to specify the desired file destination.

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo/file',
  options: { destination: '/path/to/file' }
})
bingo(transport)
```

By default, the `bingo/file` transport assumes the directory of the destination file exists. If it does not exist, the transport will throw an error when it attempts to open the file for writing. The `mkdir` option may be set to `true` to configure the transport to create the directory, if it does not exist, before opening the file for writing.

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo/file',
  options: { destination: '/path/to/file', mkdir: true }
})
bingo(transport)
```

By default, the `bingo/file` transport appends to the destination file if it exists. The `append` option may be set to `false` to configure the transport to truncate the file upon opening it for writing.

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo/file',
  options: { destination: '/path/to/file', append: false }
})
bingo(transport)
```

The `options.destination` property may also be a number to represent a file descriptor. Typically this would be `1` to write to STDOUT or `2` to write to STDERR. If `options.destination` is not set, it defaults to `1` which means logs will be written to STDOUT. If `options.destination` is a string integer, e.g. `'1'`, it will be coerced to a number and used as a file descriptor. If this is not desired, provide a full path, e.g. `/tmp/1`.

The difference between using the `bingo/file` transport builtin and using `bingo.destination` is that `bingo.destination` runs in the main thread, whereas `bingo/file` sets up `bingo.destination` in a worker thread.

#### `bingo-pretty`

The [`bingo-pretty`][bingo-pretty] transport prettifies logs.

By default the `bingo-pretty` builtin logs to STDOUT.

The `options.destination` property may be set to log pretty logs to a file descriptor or file. The following would send the prettified logs to STDERR:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-pretty',
  options: { destination: 1 } // use 2 for stderr
})
bingo(transport)
```

### Asynchronous startup

The new transports boot asynchronously and calling `process.exit()` before the transport
starts will cause logs to not be delivered.

```js
const bingo = require('bingo')
const transport = bingo.transport({
  targets: [
    { target: '/absolute/path/to/my-transport.mjs', level: 'error' },
    { target: 'some-file-transport', options: { destination: '/dev/null' } }
  ]
})
const logger = bingo(transport)

logger.info('hello')

// If logs are printed before the transport is ready when process.exit(0) is called,
// they will be lost.
transport.on('ready', function () {
  process.exit(0)
})
```

## Legacy Transports

A legacy Bingo "transport" is a supplementary tool that consumes Bingo logs.

Consider the following example for creating a transport:

```js
const { pipeline, Writable } = require('node:stream')
const split = require('split2')

const myTransportStream = new Writable({
  write (chunk, enc, cb) {
  // apply a transform and send to STDOUT
  console.log(chunk.toString().toUpperCase())
  cb()
  }
})

pipeline(process.stdin, split(JSON.parse), myTransportStream)
```

The above defines our "transport" as the file `my-transport-process.js`.

Logs can now be consumed using shell piping:

```sh
node my-app-which-logs-stuff-to-stdout.js | node my-transport-process.js
```

Ideally, a transport should consume logs in a separate process to the application,
Using transports in the same process causes unnecessary load and slows down
Node's single-threaded event loop.

## Known Transports

PRs to this document are welcome for any new transports!

### Bingo v7+ Compatible

+ [@axiomhq/bingo](#@axiomhq/bingo)
+ [@logtail/bingo](#@logtail/bingo)
+ [@macfja/bingo-fingers-crossed](#macfja-bingo-fingers-crossed)
+ [@openobserve/bingo-openobserve](#bingo-openobserve)
+ [bingo-airbrake-transport](#bingo-airbrake-transport)
+ [bingo-axiom](#bingo-axiom)
+ [bingo-datadog-transport](#bingo-datadog-transport)
+ [bingo-discord-webhook](#bingo-discord-webhook)
+ [bingo-elasticsearch](#bingo-elasticsearch)
+ [bingo-hana](#bingo-hana)
+ [bingo-logfmt](#bingo-logfmt)
+ [bingo-loki](#bingo-loki)
+ [bingo-opentelemetry-transport](#bingo-opentelemetry-transport)
+ [bingo-pretty](#bingo-pretty)
+ [bingo-roll](#bingo-roll)
+ [bingo-seq-transport](#bingo-seq-transport)
+ [bingo-sentry-transport](#bingo-sentry-transport)
+ [bingo-slack-webhook](#bingo-slack-webhook)
+ [bingo-telegram-webhook](#bingo-telegram-webhook)
+ [bingo-yc-transport](#bingo-yc-transport)

### Legacy

+ [bingo-applicationinsights](#bingo-applicationinsights)
+ [bingo-azuretable](#bingo-azuretable)
+ [bingo-cloudwatch](#bingo-cloudwatch)
+ [bingo-couch](#bingo-couch)
+ [bingo-datadog](#bingo-datadog)
+ [bingo-gelf](#bingo-gelf)
+ [bingo-http-send](#bingo-http-send)
+ [bingo-kafka](#bingo-kafka)
+ [bingo-logdna](#bingo-logdna)
+ [bingo-logflare](#bingo-logflare)
+ [bingo-loki](#bingo-loki)
+ [bingo-mq](#bingo-mq)
+ [bingo-mysql](#bingo-mysql)
+ [bingo-papertrail](#bingo-papertrail)
+ [bingo-pg](#bingo-pg)
+ [bingo-redis](#bingo-redis)
+ [bingo-sentry](#bingo-sentry)
+ [bingo-seq](#bingo-seq)
+ [bingo-socket](#bingo-socket)
+ [bingo-stackdriver](#bingo-stackdriver)
+ [bingo-syslog](#bingo-syslog)
+ [bingo-websocket](#bingo-websocket)


<a id="@axiomhq/bingo"></a>
### @axiomhq/bingo

[@axiomhq/bingo](https://www.npmjs.com/package/@axiomhq/bingo) is the official [Axiom](https://axiom.co/) transport for Bingo, using [axiom-js](https://github.com/axiomhq/axiom-js).

```javascript
import bingo from 'bingo';

const logger = bingo(
  { level: 'info' },
  bingo.transport({
    target: '@axiomhq/bingo',
    options: {
      dataset: process.env.AXIOM_DATASET,
      token: process.env.AXIOM_TOKEN,
    },
  }),
);
```

then you can use the logger as usual:

```js
logger.info('Hello from bingo!');
```

For further examples, head over to the [examples](https://github.com/axiomhq/axiom-js/tree/main/examples/bingo) directory.

<a id="@logtail/bingo"></a>
### @logtail/bingo

The [@logtail/bingo](https://www.npmjs.com/package/@logtail/bingo) NPM package is a transport that forwards logs to [Logtail](https://logtail.com) by [Better Stack](https://betterstack.com).

[Quick start guide ⇗](https://betterstack.com/docs/logs/javascript/bingo)

<a id="macfja-bingo-fingers-crossed"></a>
### @macfja/bingo-fingers-crossed

[@macfja/bingo-fingers-crossed](https://github.com/MacFJA/js-bingo-fingers-crossed) is a Bingo v7+ transport that holds logs until a log level is reached, allowing to only have logs when it matters.

```js
const bingo = require('bingo');
const { default: fingersCrossed, enable } = require('@macfja/bingo-fingers-crossed')

const logger = bingo(fingersCrossed());

logger.info('Will appear immedialty')
logger.error('Will appear immedialty')

logger.setBindings({ [enable]: 50 })
logger.info('Will NOT appear immedialty')
logger.info('Will NOT appear immedialty')
logger.error('Will appear immedialty as well as the 2 previous messages') // error log are level 50
logger.info('Will NOT appear')
logger.info({ [enable]: false }, 'Will appear immedialty')
logger.info('Will NOT appear')
```
<a id="bingo-openobserve"></a>
### @openobserve/bingo-openobserve

[@openobserve/bingo-openobserve](https://github.com/openobserve/bingo-openobserve) is a 
Bingo v7+ transport that will send logs to an 
[OpenObserve](https://openobserve.ai) instance.

```
const bingo = require('bingo');
const OpenobserveTransport = require('@openobserve/bingo-openobserve');

const logger = bingo({
  level: 'info',
  transport: {
    target: OpenobserveTransport,
    options: {
      url: 'https://your-openobserve-server.com',
      organization: 'your-organization',
      streamName: 'your-stream',
      auth: {
        username: 'your-username',
        password: 'your-password',
      },
    },
  },
});
```

For full documentation check the [README](https://github.com/openobserve/bingo-openobserve).

<a id="bingo-airbrake-transport"></a>
### bingo-airbrake-transport

[bingo-airbrake-transport][bingo-airbrake-transport] is a Bingo v7+ compatible transport to forward log events to [Airbrake][Airbrake]
from a dedicated worker:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-airbrake-transport',
  options: {
    airbrake: {
      projectId: 1,
      projectKey: "REPLACE_ME",
      environment: "production",
      // additional options for airbrake
      performanceStats: false,
    },
  },
  level: "error", // minimum log level that should be sent to airbrake
})
bingo(transport)
```

[bingo-airbrake-transport]: https://github.com/enricodeleo/bingo-airbrake-transport
[Airbrake]: https://airbrake.io/

<a id="bingo-applicationinsights"></a>
### bingo-applicationinsights
The [bingo-applicationinsights](https://www.npmjs.com/package/bingo-applicationinsights) module is a transport that will forward logs to [Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).

Given an application `foo` that logs via bingo, you would use `bingo-applicationinsights` like so:

``` sh
$ node foo | bingo-applicationinsights --key blablabla
```

For full documentation of command line switches read [README](https://github.com/ovhemert/bingo-applicationinsights#readme)

<a id="bingo-axiom"></a>
### bingo-axiom

[bingo-axiom](https://www.npmjs.com/package/bingo-axiom) is a transport that will forward logs to [Axiom](https://axiom.co).

```javascript
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-axiom',
  options: {
    orgId: 'YOUR-ORG-ID', 
    token: 'YOUR-TOKEN', 
    dataset: 'YOUR-DATASET', 
  },
})
bingo(transport)
```

<a id="bingo-azuretable"></a>
### bingo-azuretable
The [bingo-azuretable](https://www.npmjs.com/package/bingo-azuretable) module is a transport that will forward logs to the [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/).

Given an application `foo` that logs via bingo, you would use `bingo-azuretable` like so:

``` sh
$ node foo | bingo-azuretable --account storageaccount --key blablabla
```

For full documentation of command line switches read [README](https://github.com/ovhemert/bingo-azuretable#readme)

<a id="bingo-cloudwatch"></a>
### bingo-cloudwatch

[bingo-cloudwatch][bingo-cloudwatch] is a transport that buffers and forwards logs to [Amazon CloudWatch][].

```sh
$ node app.js | bingo-cloudwatch --group my-log-group
```

[bingo-cloudwatch]: https://github.com/dbhowell/bingo-cloudwatch
[Amazon CloudWatch]: https://aws.amazon.com/cloudwatch/

<a id="bingo-couch"></a>
### bingo-couch

[bingo-couch][bingo-couch] uploads each log line as a [CouchDB][CouchDB] document.

```sh
$ node app.js | bingo-couch -U https://couch-server -d mylogs
```

[bingo-couch]: https://github.com/IBM/bingo-couch
[CouchDB]: https://couchdb.apache.org

<a id="bingo-datadog"></a>
### bingo-datadog
The [bingo-datadog](https://www.npmjs.com/package/bingo-datadog) module is a transport that will forward logs to [DataDog](https://www.datadoghq.com/) through its API.

Given an application `foo` that logs via bingo, you would use `bingo-datadog` like so:

``` sh
$ node foo | bingo-datadog --key blablabla
```

For full documentation of command line switches read [README](https://github.com/ovhemert/bingo-datadog#readme)

<a id="bingo-datadog-transport"></a>
### bingo-datadog-transport

[bingo-datadog-transport][bingo-datadog-transport] is a Bingo v7+ compatible transport to forward log events to [Datadog][Datadog]
from a dedicated worker:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-datadog-transport',
  options: {
    ddClientConf: {
      authMethods: {
        apiKeyAuth: <your datadog API key>
      }
    },
  },
  level: "error", // minimum log level that should be sent to datadog
})
bingo(transport)
```

[bingo-datadog-transport]: https://github.com/theogravity/datadog-transports
[Datadog]: https://www.datadoghq.com/

#### Logstash

The [bingo-socket][bingo-socket] module can also be used to upload logs to
[Logstash][logstash] via:

```
$ node app.js | bingo-socket -a 127.0.0.1 -p 5000 -m tcp
```

Assuming logstash is running on the same host and configured as
follows:

```
input {
  tcp {
    port => 5000
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => "127.0.0.1:9200"
  }
}
```

See <https://www.elastic.co/guide/en/kibana/current/setup.html> to learn
how to setup [Kibana][kibana].

For Docker users, see
https://github.com/deviantony/docker-elk to setup an ELK stack.

<a id="bingo-discord-webhook"></a>
### bingo-discord-webhook

[bingo-discord-webhook](https://github.com/fabulousgk/bingo-discord-webhook) is a  Bingo v7+ compatible transport to forward log events to a [Discord](http://discord.com) webhook from a dedicated worker. 

```js
import bingo from 'bingo'

const logger = bingo({
  transport: {
    target: 'bingo-discord-webhook',
    options: {
      webhookUrl: 'https://discord.com/api/webhooks/xxxx/xxxx',
    }
  }
})
```

<a id="bingo-elasticsearch"></a>
### bingo-elasticsearch

[bingo-elasticsearch][bingo-elasticsearch] uploads the log lines in bulk
to [Elasticsearch][elasticsearch], to be displayed in [Kibana][kibana].

It is extremely simple to use and setup

```sh
$ node app.js | bingo-elasticsearch
```

Assuming Elasticsearch is running on localhost.

To connect to an external Elasticsearch instance (recommended for production):

* Check that `network.host` is defined in the `elasticsearch.yml` configuration file. See [Elasticsearch Network Settings documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html#common-network-settings) for more details.
* Launch:

```sh
$ node app.js | bingo-elasticsearch --node http://192.168.1.42:9200
```

Assuming Elasticsearch is running on `192.168.1.42`.

To connect to AWS Elasticsearch:

```sh
$ node app.js | bingo-elasticsearch --node https://es-url.us-east-1.es.amazonaws.com --es-version 6
```

Then [create an index pattern](https://www.elastic.co/guide/en/kibana/current/setup.html) on `'bingo'` (the default index key for `bingo-elasticsearch`) on the Kibana instance.

[bingo-elasticsearch]: https://github.com/bingo/bingo-elasticsearch
[elasticsearch]: https://www.elastic.co/products/elasticsearch
[kibana]: https://www.elastic.co/products/kibana

<a id="bingo-gelf"></a>
### bingo-gelf

Bingo GELF ([bingo-gelf]) is a transport for the Bingo logger. Bingo GELF receives Bingo logs from stdin and transforms them into [GELF format][gelf] before sending them to a remote [Graylog server][graylog] via UDP.

```sh
$ node your-app.js | bingo-gelf log
```

[bingo-gelf]: https://github.com/bingo/bingo-gelf
[gelf]: https://docs.graylog.org/en/2.1/pages/gelf.html
[graylog]: https://www.graylog.org/

<a id="bingo-hana"></a>
### bingo-hana
[bingo-hana](https://github.com/HiImGiovi/bingo-hana) is a Bingo v7+ transport that save bingo logs to a SAP HANA database.
```js
const bingo = require('bingo')
const logger = bingo({
  transport: {
    target: 'bingo-hana',
    options: {
      connectionOptions: {
        host: <hana db host>,
        port: <hana db port>,
        user: <hana db user>,
        password: <hana db password>,
      },
      schema: <schema of the table in which you want to save the logs>,
      table: <table in which you want to save the logs>,
    },
  },
})

logger.info('hi') // this log will be saved into SAP HANA
```
For more detailed information about its usage please check the official [documentation](https://github.com/HiImGiovi/bingo-hana#readme).

<a id="bingo-http-send"></a>
### bingo-http-send

[bingo-http-send](https://npmjs.com/package/bingo-http-send) is a configurable and low overhead
transport that will batch logs and send to a specified URL.

```console
$ node app.js | bingo-http-send -u http://localhost:8080/logs
```

<a id="bingo-kafka"></a>
### bingo-kafka

[bingo-kafka](https://github.com/ayZagen/bingo-kafka) transport to send logs to [Apache Kafka](https://kafka.apache.org/).

```sh
$ node index.js | bingo-kafka -b 10.10.10.5:9200 -d mytopic
```

<a id="bingo-logdna"></a>
### bingo-logdna

[bingo-logdna](https://github.com/logdna/bingo-logdna) transport to send logs to [LogDNA](https://logdna.com).

```sh
$ node index.js | bingo-logdna --key YOUR_INGESTION_KEY
```

Tags and other metadata can be included using the available command line options. See the [bingo-logdna README](https://github.com/logdna/bingo-logdna#options) for a full list.

<a id="bingo-logflare"></a>
### bingo-logflare

[bingo-logflare](https://github.com/Logflare/bingo-logflare) transport to send logs to a [Logflare](https://logflare.app) `source`.

```sh
$ node index.js | bingo-logflare --key YOUR_KEY --source YOUR_SOURCE
```

<a id="bingo-logfmt"></a>
### bingo-logfmt

[bingo-logfmt](https://github.com/botflux/bingo-logfmt) is a Bingo v7+ transport that formats logs into [logfmt](https://brandur.org/logfmt). This transport can output the formatted logs to stdout or file.

```js
import bingo from 'bingo'

const logger = bingo({
  transport: {
    target: 'bingo-logfmt'
  }
})
```

<a id="bingo-loki"></a>
### bingo-loki
bingo-loki is a transport that will forwards logs into [Grafana Loki](https://grafana.com/oss/loki/).
Can be used in CLI version in a separate process or in a dedicated worker:

CLI :
```console
node app.js | bingo-loki --hostname localhost:3100 --labels='{ "application": "my-application"}' --user my-username --password my-password
```

Worker :
```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-loki',
  options: { host: 'localhost:3100' }
})
bingo(transport)
```

For full documentation and configuration, see the [README](https://github.com/Julien-R44/bingo-loki).

<a id="bingo-mq"></a>
### bingo-mq

The `bingo-mq` transport will take all messages received on `process.stdin` and send them over a message bus using JSON serialization.

This is useful for:

* moving backpressure from application to broker
* transforming messages pressure to another component

```
node app.js | bingo-mq -u "amqp://guest:guest@localhost/" -q "bingo-logs"
```

Alternatively, a configuration file can be used:

```
node app.js | bingo-mq -c bingo-mq.json
```

A base configuration file can be initialized with:

```
bingo-mq -g
```

For full documentation of command line switches and configuration see [the `bingo-mq` README](https://github.com/itavy/bingo-mq#readme)

<a id="bingo-mysql"></a>
### bingo-mysql

[bingo-mysql][bingo-mysql] loads bingo logs into [MySQL][MySQL] and [MariaDB][MariaDB].

```sh
$ node app.js | bingo-mysql -c db-configuration.json
```

`bingo-mysql` can extract and save log fields into corresponding database fields
and/or save the entire log stream as a [JSON Data Type][JSONDT].

For full documentation and command line switches read the [README][bingo-mysql].

[bingo-mysql]: https://www.npmjs.com/package/bingo-mysql
[MySQL]: https://www.mysql.com/
[MariaDB]: https://mariadb.org/
[JSONDT]: https://dev.mysql.com/doc/refman/8.0/en/json.html

<a id="bingo-opentelemetry-transport"></a>
### bingo-opentelemetry-transport

[bingo-opentelemetry-transport](https://www.npmjs.com/package/bingo-opentelemetry-transport) is a transport that will forward logs to an [OpenTelemetry log collector](https://opentelemetry.io/docs/collector/) using [OpenTelemetry JS instrumentation](https://opentelemetry.io/docs/instrumentation/js/).

```javascript
const bingo = require('bingo')

const transport = bingo.transport({
  target: 'bingo-opentelemetry-transport',
  options: {
    resourceAttributes: {
      'service.name': 'test-service',
      'service.version': '1.0.0'
    }
  }
})

bingo(transport)
```

Documentation on running a minimal example is available in the [README](https://github.com/Vunovati/bingo-opentelemetry-transport#minimalistic-example).

<a id="bingo-papertrail"></a>
### bingo-papertrail
bingo-papertrail is a transport that will forward logs to the [papertrail](https://papertrailapp.com) log service through an UDPv4 socket.

Given an application `foo` that logs via bingo, and a papertrail destination that collects logs on port UDP `12345` on address `bar.papertrailapp.com`, you would use `bingo-papertrail`
like so:

```
node yourapp.js | bingo-papertrail --host bar.papertrailapp.com --port 12345 --appname foo
```


for full documentation of command line switches read [README](https://github.com/ovhemert/bingo-papertrail#readme)

<a id="bingo-pg"></a>
### bingo-pg
[bingo-pg](https://www.npmjs.com/package/bingo-pg) stores logs into PostgreSQL.
Full documentation in the [README](https://github.com/Xstoudi/bingo-pg).

<a id="bingo-redis"></a>
### bingo-redis

[bingo-redis][bingo-redis] loads bingo logs into [Redis][Redis].

```sh
$ node app.js | bingo-redis -U redis://username:password@localhost:6379
```

[bingo-redis]: https://github.com/buianhthang/bingo-redis
[Redis]: https://redis.io/

<a id="bingo-roll"></a>
### bingo-roll

`bingo-roll` is a Bingo transport that automatically rolls your log files based on size or time frequency.

```js
import { join } from 'path';
import bingo from 'bingo';

const transport = bingo.transport({
  target: 'bingo-roll',
  options: { file: join('logs', 'log'), frequency: 'daily', mkdir: true }
});

const logger = bingo(transport);
```

then you can use the logger as usual:

```js
logger.info('Hello from bingo-roll!');
```
For full documentation check the [README](https://github.com/mcollina/bingo-roll?tab=readme-ov-file#bingo-roll).

<a id="bingo-sentry"></a>
### bingo-sentry

[bingo-sentry][bingo-sentry] loads bingo logs into [Sentry][Sentry].

```sh
$ node app.js | bingo-sentry --dsn=https://******@sentry.io/12345
```

For full documentation of command line switches see the [bingo-sentry README](https://github.com/aandrewww/bingo-sentry/blob/master/README.md).

[bingo-sentry]: https://www.npmjs.com/package/bingo-sentry
[Sentry]: https://sentry.io/

<a id="bingo-sentry-transport"></a>
### bingo-sentry-transport

[bingo-sentry-transport][bingo-sentry-transport] is a Bingo v7+ compatible transport to forward log events to [Sentry][Sentry]
from a dedicated worker:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: 'bingo-sentry-transport',
  options: {
    sentry: {
      dsn: 'https://******@sentry.io/12345',
    }
  }
})
bingo(transport)
```

[bingo-sentry-transport]: https://github.com/tomer-yechiel/bingo-sentry-transport
[Sentry]: https://sentry.io/

<a id="bingo-seq"></a>
### bingo-seq

[bingo-seq][bingo-seq] supports both out-of-process and in-process log forwarding to [Seq][Seq].

```sh
$ node app.js | bingo-seq --serverUrl http://localhost:5341 --apiKey 1234567890 --property applicationName=MyNodeApp
```

[bingo-seq]: https://www.npmjs.com/package/bingo-seq
[Seq]: https://datalust.co/seq

<a id="bingo-seq-transport"></a>
### bingo-seq-transport

[bingo-seq-transport][bingo-seq-transport] is a Bingo v7+ compatible transport to forward log events to [Seq][Seq]
from a dedicated worker:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: '@autotelic/bingo-seq-transport',
  options: { serverUrl: 'http://localhost:5341' }
})
bingo(transport)
```

[bingo-seq-transport]: https://github.com/autotelic/bingo-seq-transport
[Seq]: https://datalust.co/seq

<a id="bingo-slack-webhook"></a>
### bingo-slack-webhook

[bingo-slack-webhook][bingo-slack-webhook] is a Bingo v7+ compatible transport to forward log events to [Slack][Slack]
from a dedicated worker:

```js
const bingo = require('bingo')
const transport = bingo.transport({
  target: '@youngkiu/bingo-slack-webhook',
  options: {
    webhookUrl: 'https://hooks.slack.com/services/xxx/xxx/xxx',
    channel: '#bingo-log',
    username: 'webhookbot',
    icon_emoji: ':ghost:'
  }
})
bingo(transport)
```

[bingo-slack-webhook]: https://github.com/youngkiu/bingo-slack-webhook
[Slack]: https://slack.com/

[bingo-pretty]: https://github.com/bingo/bingo-pretty

For full documentation of command line switches read the [README](https://github.com/abeai/bingo-websocket#readme).

<a id="bingo-socket"></a>
### bingo-socket

[bingo-socket][bingo-socket] is a transport that will forward logs to an IPv4
UDP or TCP socket.

As an example, use `socat` to fake a listener:

```sh
$ socat -v udp4-recvfrom:6000,fork exec:'/bin/cat'
```

Then run an application that uses `bingo` for logging:

```sh
$ node app.js | bingo-socket -p 6000
```

Logs from the application should be observed on both consoles.

[bingo-socket]: https://www.npmjs.com/package/bingo-socket

<a id="bingo-stackdriver"></a>
### bingo-stackdriver
The [bingo-stackdriver](https://www.npmjs.com/package/bingo-stackdriver) module is a transport that will forward logs to the [Google Stackdriver](https://cloud.google.com/logging/) log service through its API.

Given an application `foo` that logs via bingo, a stackdriver log project `bar`, and credentials in the file `/credentials.json`, you would use `bingo-stackdriver`
like so:

``` sh
$ node foo | bingo-stackdriver --project bar --credentials /credentials.json
```

For full documentation of command line switches read [README](https://github.com/ovhemert/bingo-stackdriver#readme)

<a id="bingo-syslog"></a>
### bingo-syslog

[bingo-syslog][bingo-syslog] is a transforming transport that converts
`bingo` NDJSON logs to [RFC3164][rfc3164] compatible log messages. The `bingo-syslog` module does not
forward the logs anywhere, it merely re-writes the messages to `stdout`. But
when used in combination with `bingo-socket` the log messages can be relayed to a syslog server:

```sh
$ node app.js | bingo-syslog | bingo-socket -a syslog.example.com
```

Example output for the "hello world" log:

```
<134>Apr  1 16:44:58 MacBook-Pro-3 none[94473]: {"pid":94473,"hostname":"MacBook-Pro-3","level":30,"msg":"hello world","time":1459529098958}
```

[bingo-syslog]: https://www.npmjs.com/package/bingo-syslog
[rfc3164]: https://tools.ietf.org/html/rfc3164
[logstash]: https://www.elastic.co/products/logstash

<a id="bingo-telegram-webhook"></a>
### bingo-telegram-webhook

[bingo-telegram-webhook](https://github.com/Jhon-Mosk/bingo-telegram-webhook) is a Bingo v7+ transport for sending messages to [Telegram](https://telegram.org/). 

```js
const bingo = require('bingo');

const logger = bingo({
  transport: {
    target: 'bingo-telegram-webhook',
    level: 'error',
    options: {
      chatId: -1234567890,
      botToken: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
      extra: {
              parse_mode: "HTML",
            },
    },
  },
})

logger.error('<b>test log!</b>');
```

The `extra` parameter is optional. Parameters that the method [`sendMessage`](https://core.telegram.org/bots/api#sendmessage) supports can be passed to it.

<a id="bingo-websocket"></a>
### bingo-websocket

[bingo-websocket](https://www.npmjs.com/package/@abeai/bingo-websocket) is a transport that will forward each log line to a websocket server.

```sh
$ node app.js | bingo-websocket -a my-websocket-server.example.com -p 3004
```

For full documentation of command line switches read the [README](https://github.com/abeai/bingo-websocket#readme).

<a id="bingo-yc-transport"></a>
### bingo-yc-transport

[bingo-yc-transport](https://github.com/Jhon-Mosk/bingo-yc-transport) is a Bingo v7+ transport for writing to [Yandex Cloud Logging](https://yandex.cloud/ru/services/logging) from serveless functions or containers.

```js
const bingo = require("bingo");

const config = {
  level: "debug",
  transport: {
    target: "bingo-yc-transport",
  },
};

const logger = bingo(config);

logger.debug("some message")
logger.debug({ foo: "bar" });
logger.debug("some message %o, %s", { foo: "bar" }, "baz");
logger.info("info");
logger.warn("warn");
logger.error("error");
logger.error(new Error("error"));
logger.fatal("fatal");
```

<a id="communication-between-bingo-and-transport"></a>
## Communication between Bingo and Transports
Here we discuss some technical details of how Bingo communicates with its [worker threads](https://nodejs.org/api/worker_threads.html).

Bingo uses [`thread-stream`](https://github.com/bingo/thread-stream) to create a stream for transports.
When we create a stream with `thread-stream`, `thread-stream` spawns a [worker](https://github.com/bingo/thread-stream/blob/f19ac8dbd602837d2851e17fbc7dfc5bbc51083f/index.js#L50-L60) (an independent JavaScript execution thread).

### Error messages
How are error messages propagated from a transport worker to Bingo?

Let's assume we have a transport with an error listener:
```js
// index.js
const transport = bingo.transport({
  target: './transport.js'
})

transport.on('error', err => {
  console.error('error caught', err)
})

const log = bingo(transport)
```

When our worker emits an error event, the worker has listeners for it: [error](https://github.com/bingo/thread-stream/blob/f19ac8dbd602837d2851e17fbc7dfc5bbc51083f/lib/worker.js#L59-L70) and [unhandledRejection](https://github.com/bingo/thread-stream/blob/f19ac8dbd602837d2851e17fbc7dfc5bbc51083f/lib/worker.js#L135-L141). These listeners send the error message to the main thread where Bingo is present.

When Bingo receives the error message, it further [emits](https://github.com/bingo/thread-stream/blob/f19ac8dbd602837d2851e17fbc7dfc5bbc51083f/index.js#L349) the error message. Finally, the error message arrives at our `index.js` and is caught by our error listener.
