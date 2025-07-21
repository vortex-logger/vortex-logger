import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { expectError, expectType } from 'tsd';
import P, { LoggerOptions, bingo } from "../../bingo-logger";
import Logger = P.Logger;

const log = bingo();
const info = log.info;
const error = log.error;

info("hello world");
error("this is at error level");
info("the answer is %d", 42);
info({ obj: 42 }, "hello world");
info({ obj: 42, b: 2 }, "hello world");
info({ obj: { aa: "bbb" } }, "another");
setImmediate(info, "after setImmediate");
error(new Error("an error"));

const writeSym = bingo.symbols.writeSym;

const testUniqSymbol = {
    [bingo.symbols.needsMetadataGsym]: true,
}[bingo.symbols.needsMetadataGsym];

const log2: P.Logger = bingo({
    name: "myapp",
    safe: true,
    serializers: {
        req: bingo.stdSerializers.req,
        res: bingo.stdSerializers.res,
        err: bingo.stdSerializers.err,
    },
});

bingo({
    write(o) {},
});

bingo({
    mixin() {
        return { customName: "unknown", customId: 111 };
    },
});

bingo({
    mixin: () => ({ customName: "unknown", customId: 111 }),
});

bingo({
    mixin: (context: object) => ({ customName: "unknown", customId: 111 }),
});

bingo({
    mixin: (context: object, level: number) => ({ customName: "unknown", customId: 111 }),
});

bingo({
    redact: { paths: [], censor: "SECRET" },
});

bingo({
    redact: { paths: [], censor: () => "SECRET" },
});

bingo({
    redact: { paths: [], censor: (value) => value },
});

bingo({
    redact: { paths: [], censor: (value, path) => path.join() },
});

bingo({
    depthLimit: 1
});

bingo({
    edgeLimit: 1
});

bingo({
    browser: {
        write(o) {},
    },
});

bingo({
    browser: {
        write: {
            info(o) {},
            error(o) {},
        },
        serialize: true,
        asObject: true,
        transmit: {
            level: "fatal",
            send: (level, logEvent) => {
                level;
                logEvent.bindings;
                logEvent.level;
                logEvent.ts;
                logEvent.messages;
            },
        },
        disabled: false
    },
});

bingo({}, undefined);

bingo({ base: null });
if ("bingo" in log) console.log(`bingo version: ${log.bingo}`);

expectType<void>(log.flush());
log.flush((err?: Error) => undefined);
log.child({ a: "property" }).info("hello child!");
log.level = "error";
log.info("nope");
const child = log.child({ foo: "bar" });
child.info("nope again");
child.level = "info";
child.info("hooray");
log.info("nope nope nope");
log.child({ foo: "bar" }, { level: "debug" }).debug("debug!");
child.bindings();
const customSerializers = {
    test() {
        return "this is my serializer";
    },
};
bingo().child({}, { serializers: customSerializers }).info({ test: "should not show up" });
const child2 = log.child({ father: true });
const childChild = child2.child({ baby: true });
const childRedacted = bingo().child({}, { redact: ["path"] })
childRedacted.info({
  msg: "logged with redacted properties",
  path: "Not shown",
});
const childAnotherRedacted = bingo().child({}, {
    redact: {
        paths: ["anotherPath"],
        censor: "Not the log you\re looking for",
    }
})
childAnotherRedacted.info({
    msg: "another logged with redacted properties",
    anotherPath: "Not shown",
});

log.level = "info";
if (log.levelVal === 30) {
    console.log("logger level is `info`");
}

const listener = (lvl: any, val: any, prevLvl: any, prevVal: any) => {
    console.log(lvl, val, prevLvl, prevVal);
};
log.on("level-change", (lvl, val, prevLvl, prevVal, logger) => {
    console.log(lvl, val, prevLvl, prevVal);
});
log.level = "trace";
log.removeListener("level-change", listener);
log.level = "info";

bingo.levels.values.error === 50;
bingo.levels.labels[50] === "error";

const logstderr: bingo.Logger = bingo(process.stderr);
logstderr.error("on stderr instead of stdout");

log.useLevelLabels = true;
log.info("lol");
log.level === "info";
const isEnabled: boolean = log.isLevelEnabled("info");

const redacted = bingo({
    redact: ["path"],
});

redacted.info({
    msg: "logged with redacted properties",
    path: "Not shown",
});

const anotherRedacted = bingo({
    redact: {
        paths: ["anotherPath"],
        censor: "Not the log you\re looking for",
    },
});

anotherRedacted.info({
    msg: "another logged with redacted properties",
    anotherPath: "Not shown",
});

const withTimeFn = bingo({
    timestamp: bingo.stdTimeFunctions.isoTime,
});

const withNestedKey = bingo({
    nestedKey: "payload",
});

const withHooks = bingo({
    hooks: {
        logMethod(args, method, level) {
            expectType<bingo.Logger>(this);
            return method.apply(this, args);
        },
        streamWrite(s) {
            expectType<string>(s);
            return s.replaceAll('secret-key', 'xxx');
        },
    },
});

// Properties/types imported from pino-std-serializers
const wrappedErrSerializer = bingo.stdSerializers.wrapErrorSerializer((err: bingo.SerializedError) => {
    return { ...err, newProp: "foo" };
});
const wrappedReqSerializer = bingo.stdSerializers.wrapRequestSerializer((req: bingo.SerializedRequest) => {
    return { ...req, newProp: "foo" };
});
const wrappedResSerializer = bingo.stdSerializers.wrapResponseSerializer((res: bingo.SerializedResponse) => {
    return { ...res, newProp: "foo" };
});

const socket = new Socket();
const incomingMessage = new IncomingMessage(socket);
const serverResponse = new ServerResponse(incomingMessage);

const mappedHttpRequest: { req: bingo.SerializedRequest } = bingo.stdSerializers.mapHttpRequest(incomingMessage);
const mappedHttpResponse: { res: bingo.SerializedResponse } = bingo.stdSerializers.mapHttpResponse(serverResponse);

const serializedErr: bingo.SerializedError = bingo.stdSerializers.err(new Error());
const serializedReq: bingo.SerializedRequest = bingo.stdSerializers.req(incomingMessage);
const serializedRes: bingo.SerializedResponse = bingo.stdSerializers.res(serverResponse);

/**
 * Destination static method
 */
const destinationViaDefaultArgs = bingo.destination();
const destinationViaStrFileDescriptor = bingo.destination("/log/path");
const destinationViaNumFileDescriptor = bingo.destination(2);
const destinationViaStream = bingo.destination(process.stdout);
const destinationViaOptionsObject = bingo.destination({ dest: "/log/path", sync: false });

bingo(destinationViaDefaultArgs);
bingo({ name: "my-logger" }, destinationViaDefaultArgs);
bingo(destinationViaStrFileDescriptor);
bingo({ name: "my-logger" }, destinationViaStrFileDescriptor);
bingo(destinationViaNumFileDescriptor);
bingo({ name: "my-logger" }, destinationViaNumFileDescriptor);
bingo(destinationViaStream);
bingo({ name: "my-logger" }, destinationViaStream);
bingo(destinationViaOptionsObject);
bingo({ name: "my-logger" }, destinationViaOptionsObject);

try {
    throw new Error('Some error')
} catch (err) {
    log.error(err)
}

interface StrictShape {
    activity: string;
    err?: unknown;
}

info<StrictShape>({
    activity: "Required property",
});

const logLine: bingo.LogDescriptor = {
    level: 20,
    msg: "A log message",
    time: new Date().getTime(),
    aCustomProperty: true,
};

interface CustomLogger extends bingo.Logger {
    customMethod(msg: string, ...args: unknown[]): void;
}

const serializerFunc: bingo.SerializerFn = () => {}
const writeFunc: bingo.WriteFn = () => {}

interface CustomBaseLogger extends bingo.BaseLogger {
  child(): CustomBaseLogger
}

const customBaseLogger: CustomBaseLogger = {
  level: 'info',
  fatal() {},
  error() {},
  warn() {},
  info() {},
  debug() {},
  trace() {},
  silent() {},
  child() { return this }
}

// custom levels
const log3 = bingo({ customLevels: { myLevel: 100 } })
expectError(log3.log())
log3.level = 'myLevel'
log3.myLevel('')
log3.child({}).myLevel('')

log3.on('level-change', (lvl, val, prevLvl, prevVal, instance) => {
    instance.myLevel('foo');
});

const clog3 = log3.child({}, { customLevels: { childLevel: 120 } })
// child inherit parent
clog3.myLevel('')
// child itself
clog3.childLevel('')
const cclog3 = clog3.child({}, { customLevels: { childLevel2: 130 } })
// child inherit root
cclog3.myLevel('')
// child inherit parent
cclog3.childLevel('')
// child itself
cclog3.childLevel2('')

const ccclog3 = clog3.child({})
expectError(ccclog3.nonLevel(''))

const withChildCallback = bingo({
    onChild: (child: Logger) => {}
})
withChildCallback.onChild = (child: Logger) => {}

bingo({
    crlf: true,
});

const customLevels = { foo: 99, bar: 42 }

const customLevelLogger = bingo({ customLevels });

type CustomLevelLogger = typeof customLevelLogger
type CustomLevelLoggerLevels = bingo.Level | keyof typeof customLevels

const fn = (logger: Pick<CustomLevelLogger, CustomLevelLoggerLevels>) => {}

const customLevelChildLogger = customLevelLogger.child({ name: "child" })

fn(customLevelChildLogger); // missing foo typing

// unknown option
expectError(
  bingo({
    hello: 'world'
  })
);

// unknown option
expectError(
  bingo({
    hello: 'world',
    customLevels: {
      'log': 30
    }
  })
);

function dangerous () {
  throw Error('foo')
}

try {
  dangerous()
} catch (err) {
  log.error(err)
}

try {
  dangerous()
} catch (err) {
  log.error({ err })
}

const bLogger = bingo({
  customLevels: {
    log: 5,
  },
  level: 'log',
  transport: {
    target: 'bingo-pretty',
    options: {
      colorize: true,
    },
  },
});

expectType<Logger<'log'>>(bingo({
  customLevels: {
    log: 5,
  },
  level: 'log',
  transport: {
    target: 'bingo-pretty',
    options: {
      colorize: true,
    },
  },
}))

const parentLogger1 = bingo({
  customLevels: { myLevel: 90 },
  onChild: (child) => { const a = child.myLevel; }
}, process.stdout)
parentLogger1.onChild = (child) => { child.myLevel(''); }

const childLogger1 = parentLogger1.child({});
childLogger1.myLevel('');
expectError(childLogger1.doesntExist(''));

const parentLogger2 = bingo({}, process.stdin);
expectError(parentLogger2.onChild = (child) => { const b = child.doesntExist; });

const childLogger2 = parentLogger2.child({});
expectError(childLogger2.doesntExist);

expectError(bingo({
  onChild: (child) => { const a = child.doesntExist; }
}, process.stdout));

const bingoWithoutLevelsSorting = bingo({});
const bingoWithDescSortingLevels = bingo({ levelComparison: 'DESC' });
const bingoWithAscSortingLevels = bingo({ levelComparison: 'ASC' });
const bingoWithCustomSortingLevels = bingo({ levelComparison: () => false });
// with wrong level comparison direction
expectError(bingo({ levelComparison: 'SOME'}), process.stdout);
// with wrong level comparison type
expectError(bingo({ levelComparison: 123}), process.stdout);
// with wrong custom level comparison return type
expectError(bingo({ levelComparison: () => null }), process.stdout);
expectError(bingo({ levelComparison: () => 1 }), process.stdout);
expectError(bingo({ levelComparison: () => 'string' }), process.stdout);

const customLevelsOnlyOpts = {
    useOnlyCustomLevels: true,
    customLevels: {
        customDebug: 10,
        info: 20, // to make sure the default names are also available for override
        customNetwork: 30,
        customError: 40,
    },
    level: 'customDebug',
} satisfies LoggerOptions;

const loggerWithCustomLevelOnly = bingo(customLevelsOnlyOpts);
loggerWithCustomLevelOnly.customDebug('test3')
loggerWithCustomLevelOnly.info('test4')
loggerWithCustomLevelOnly.customError('test5')
loggerWithCustomLevelOnly.customNetwork('test6')

expectError(loggerWithCustomLevelOnly.fatal('test'));
expectError(loggerWithCustomLevelOnly.error('test'));
expectError(loggerWithCustomLevelOnly.warn('test'));
expectError(loggerWithCustomLevelOnly.debug('test'));
expectError(loggerWithCustomLevelOnly.trace('test'));
