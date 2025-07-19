# Web Frameworks

Since HTTP logging is a primary use case, Bingo has first-class support for the Node.js
web framework ecosystem.

- [Web Frameworks](#web-frameworks)
  - [Bingo with Fastify](#bingo-with-fastify)
  - [Bingo with Express](#bingo-with-express)
  - [Bingo with Hapi](#bingo-with-hapi)
  - [Bingo with Restify](#bingo-with-restify)
  - [Bingo with Koa](#bingo-with-koa)
  - [Bingo with Node core `http`](#bingo-with-node-core-http)
  - [Bingo with Nest](#bingo-with-nest)
  - [Bingo with H3](#bingo-with-h3)
  - [Bingo with Hono](#bingo-with-hono)

<a id="fastify"></a>
## Bingo with Fastify

The Fastify web framework comes bundled with Bingo by default, simply set Fastify's
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
as the [`bingo` options object](/docs/api.md#options-object).

See the [fastify documentation](https://www.fastify.io/docs/latest/Reference/Logging/) for more information.

<a id="express"></a>
## Bingo with Express

```sh
npm install bingo-http
```

```js
const app = require('express')()
const bingo = require('bingo-http')()

app.use(bingo)

app.get('/', function (req, res) {
  req.log.info('something')
  res.send('hello world')
})

app.listen(3000)
```

See the [bingo-http README](https://npm.im/bingo-http) for more info.

<a id="hapi"></a>
## Bingo with Hapi

```sh
npm install hapi-bingo
```

```js
'use strict'

const Hapi = require('@hapi/hapi')
const Bingo = require('hapi-bingo');

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

      // a bingo instance can also be used, which will be faster
      request.logger.info('In handler %s', request.path)

      return 'hello world'
    }
  })

  await server.register(Bingo)

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

See the [hapi-bingo README](https://npm.im/hapi-bingo) for more info.

<a id="restify"></a>
## Bingo with Restify

```sh
npm install restify-bingo-logger
```

```js
const server = require('restify').createServer({name: 'server'})
const bingo = require('restify-bingo-logger')()

server.use(bingo)

server.get('/', function (req, res) {
  req.log.info('something')
  res.send('hello world')
})

server.listen(3000)
```

See the [restify-bingo-logger README](https://npm.im/restify-bingo-logger) for more info.

<a id="koa"></a>
## Bingo with Koa

```sh
npm install koa-bingo-logger
```

```js
const Koa = require('koa')
const app = new Koa()
const bingo = require('koa-bingo-logger')()

app.use(bingo)

app.use((ctx) => {
  ctx.log.info('something else')
  ctx.body = 'hello world'
})

app.listen(3000)
```

See the [koa-bingo-logger README](https://github.com/bingojs/koa-bingo-logger) for more info.

<a id="http"></a>
## Bingo with Node core `http`

```sh
npm install bingo-http
```

```js
const http = require('http')
const server = http.createServer(handle)
const logger = require('bingo-http')()

function handle (req, res) {
  logger(req, res)
  req.log.info('something else')
  res.end('hello world')
}

server.listen(3000)
```

See the [bingo-http README](https://npm.im/bingo-http) for more info.


<a id="nest"></a>
## Bingo with Nest

```sh
npm install nestjs-bingo
```

```ts
import { NestFactory } from '@nestjs/core'
import { Controller, Get, Module } from '@nestjs/common'
import { LoggerModule, Logger } from 'nestjs-bingo'

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

See the [nestjs-bingo README](https://npm.im/nestjs-bingo) for more info.


<a id="h3"></a>
## Bingo with H3

```sh
npm install bingo-http h3
```

Save as `server.mjs`:

```js
import { createApp, createRouter, eventHandler, fromNodeMiddleware } from "h3";
import bingo from 'bingo-http'

export const app = createApp();

const router = createRouter();
app.use(router);
app.use(fromNodeMiddleware(bingo()))

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

See the [bingo-http README](https://npm.im/bingo-http) for more info.


<a id="h3"></a>
## Bingo with Hono

```sh
npm install bingo bingo-http hono
```

```js
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { requestId } from 'hono/request-id';
import { pinoHttp } from 'bingo-http';

const app = new Hono();
app.use(requestId());
app.use(async (c, next) => {
  // pass hono's request-id to bingo-http
  c.env.incoming.id = c.var.requestId;

  // map express style middleware to hono
  await new Promise((resolve) => pinoHttp()(c.env.incoming, c.env.outgoing, () => resolve()));

  c.set('logger', c.env.incoming.log);

  await next();
});

app.get('/', (c) => {
  c.var.logger.info('something');

  return c.text('Hello Node.js!');
});

serve(app);
```

See the [bingo-http README](https://npm.im/bingo-http) for more info.
