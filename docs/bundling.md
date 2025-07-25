# Bundling

Due to its internal architecture based on Worker Threads, it is not possible to bundle Bingo *without* generating additional files.

In particular, a bundler must ensure that the following files are also bundled separately:

* `lib/worker.js` from the `thread-stream` dependency
* `file.js`
* `lib/worker.js`
* Any transport used by the user (like `pino-pretty`)

Once the files above have been generated, the bundler must also add information about the files above by injecting a code that sets `__bundlerPathsOverrides` in the `globalThis` object.

The variable is an object whose keys are an identifier for the files and the values are the paths of files relative to the currently bundle files.

Example:

```javascript
// Inject this using your bundle plugin
globalThis.__bundlerPathsOverrides = {
  'thread-stream-worker': bingoWebpackAbsolutePath('./thread-stream-worker.js')
  'bingo-logger/file': bingoWebpackAbsolutePath('./bingo-file.js'),
  'bingo-worker': bingoWebpackAbsolutePath('./bingo-worker.js'),
  'pino-pretty': bingoWebpackAbsolutePath('./pino-pretty.js'),
};
```

Note that `bingo-logger/file`, `bingo-worker` and `thread-stream-worker` are required identifiers. Other identifiers are possible based on the user configuration.

## Webpack Plugin

If you are a Webpack user, you can achieve this with [bingo-webpack-plugin](https://github.com/bingojs/bingo-webpack-plugin) without manual configuration of `__bundlerPathsOverrides`; however, you still need to configure it manually if you are using other bundlers.

## Esbuild Plugin

[esbuild-plugin-bingo](https://github.com/davipon/esbuild-plugin-bingo) is the esbuild plugin to generate extra bingo files for bundling.

## Bun Plugin

[bun-plugin-bingo](https://github.com/vktrl/bun-plugin-bingo) is the Bun plugin to generate extra bingo files for bundling.