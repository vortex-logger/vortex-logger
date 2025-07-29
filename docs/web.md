# Web Frameworks

Since HTTP logging is a primary use case, Zenlog has first-class support for the Node.js
web framework ecosystem.

- [Web Frameworks](#web-frameworks)
  - [Zenlog with Fastify](#zenlog-with-fastify)
  - [Zenlog with Express](#zenlog-with-express)
  - [Zenlog with Hapi](#zenlog-with-hapi)
  - [Zenlog with Restify](#zenlog-with-restify)
  - [Zenlog with Koa](#zenlog-with-koa)
  - [Zenlog with Node core `http`](#zenlog-with-node-core-http)
  - [Zenlog with Nest](#zenlog-with-nest)
  - [Zenlog with H3](#zenlog-with-h3)
  - [Zenlog with Hono](#zenlog-with-hono)

<a id="fastify"></a>
## Zenlog with Fastify

The Fastify web framework comes bundled with Zenlog by default, simply set Fastify's
`logger` option to `true` and use `request.log` or `reply.log` for log messages that correspond
to each request:

```js
const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {
  request.log.info('something')
  return { hello: 'world' }
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
```

The `logger` option can also be set to an object, which will be passed through directly
as the [`zenlog` options object](/docs/api.md#options-object).

See the [fastify documentation](https://www.fastify.io/docs/latest/Reference/Logging/) for more information.

<a id="express"></a>
## Zenlog with Express

```sh
npm install zenlog-http
```

```js
const app = require('express')()
const zenlog = require('zenlog-http')()

app.use(zenlog)

app.get('/', function (req, res) {
  req.log.info('something')
  res.send('hello world')
})

app.listen(3000)
```

See the [zenlog-http README](https://npm.im/zenlog-http) for more info.

<a id="hapi"></a>
## Zenlog with Hapi

```sh
npm install hapi-zenlog
```

```js
'use strict'

const Hapi = require('@hapi/hapi')
const Zenlog = require('hapi-zenlog');

async function start () {
  // Create a server with a host and port
  const server = Hapi.server({
    host: 'localhost',
    port: 3000
  })

  // Add the route
  server.route({
    method: 'GET',
    path: '/',
    handler: async function (request, h) {
      // request.log is HAPI's standard way of logging
      request.log(['a', 'b'], 'Request into hello world')

      // a zenlog instance can also be used, which will be faster
      request.logger.info('In handler %s', request.path)

      return 'hello world'
    }
  })

  await server.register(Zenlog)

  // also as a decorated API
  server.logger.info('another way for accessing it')

  // and through Hapi standard logging system
  server.log(['subsystem'], 'third way for accessing it')

  await server.start()

  return server
}

start().catch((err) => {
  console.log(err)
  process.exit(1)
})
```

See the [hapi-zenlog README](https://npm.im/hapi-zenlog) for more info.

<a id="restify"></a>
## Zenlog with Restify

```sh
npm install restify-zenlog
```

```js
const server = require('restify').createServer({name: 'server'})
const zenlog = require('restify-zenlog')()

server.use(zenlog)

server.get('/', function (req, res) {
  req.log.info('something')
  res.send('hello world')
})

server.listen(3000)
```

See the [restify-zenlog README](https://npm.im/restify-zenlog) for more info.

<a id="koa"></a>
## Zenlog with Koa

```sh
npm install koa-zenlog
```

```js
const Koa = require('koa')
const app = new Koa()
const zenlog = require('koa-zenlog')()

app.use(zenlog)

app.use((ctx) => {
  ctx.log.info('something else')
  ctx.body = 'hello world'
})

app.listen(3000)
```

See the [koa-zenlog README](https://github.com/zenlogjs/koa-zenlog) for more info.

<a id="http"></a>
## Zenlog with Node core `http`

```sh
npm install zenlog-http
```

```js
const http = require('http')
const server = http.createServer(handle)
const logger = require('zenlog-http')()

function handle (req, res) {
  logger(req, res)
  req.log.info('something else')
  res.end('hello world')
}

server.listen(3000)
```

See the [zenlog-http README](https://npm.im/zenlog-http) for more info.


<a id="nest"></a>
## Zenlog with Nest

```sh
npm install nestjs-zenlog
```

```ts
import { NestFactory } from '@nestjs/core'
import { Controller, Get, Module } from '@nestjs/common'
import { LoggerModule, Logger } from 'nestjs-zenlog'

@Controller()
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get()
  getHello() {
    this.logger.log('something')
    return `Hello world`
  }
}

@Module({
  controllers: [AppController],
  imports: [LoggerModule.forRoot()]
})
class MyModule {}

async function bootstrap() {
  const app = await NestFactory.create(MyModule)
  await app.listen(3000)
}
bootstrap()
```

See the [nestjs-zenlog README](https://npm.im/nestjs-zenlog) for more info.


<a id="h3"></a>
## Zenlog with H3

```sh
npm install zenlog-http h3
```

Save as `server.mjs`:

```js
import { createApp, createRouter, eventHandler, fromNodeMiddleware } from "h3";
import zenlog from 'zenlog-http'

export const app = createApp();

const router = createRouter();
app.use(router);
app.use(fromNodeMiddleware(zenlog()))

app.use(eventHandler((event) => {
  event.node.req.log.info('something')
  return 'hello world'
}))

router.get(
  "/",
  eventHandler((event) => {
    return { path: event.path, message: "Hello World!" };
  }),
);
```

Execute `npx --yes listhen -w --open ./server.mjs`.

See the [zenlog-http README](https://npm.im/zenlog-http) for more info.


<a id="h3"></a>
## Zenlog with Hono

```sh
npm install zenlog zenlog-http hono
```

```js
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { requestId } from 'hono/request-id';
import { zenlogHttp } from 'zenlog-http';

const app = new Hono();
app.use(requestId());
app.use(async (c, next) => {
  // pass hono's request-id to zenlog-http
  c.env.incoming.id = c.var.requestId;

  // map express style middleware to hono
  await new Promise((resolve) => zenlogHttp()(c.env.incoming, c.env.outgoing, () => resolve()));

  c.set('logger', c.env.incoming.log);

  await next();
});

app.get('/', (c) => {
  c.var.logger.info('something');

  return c.text('Hello Node.js!');
});

serve(app);
```

See the [zenlog-http README](https://npm.im/zenlog-http) for more info.
