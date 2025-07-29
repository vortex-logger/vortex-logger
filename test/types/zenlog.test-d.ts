import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { expectError, expectType } from 'tsd';
import P, { LoggerOptions, zenlog } from "../../zenlog";
import Logger = P.Logger;

const log = zenlog();
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

const writeSym = zenlog.symbols.writeSym;

const testUniqSymbol = {
    [zenlog.symbols.needsMetadataGsym]: true,
}[zenlog.symbols.needsMetadataGsym];

const log2: P.Logger = zenlog({
    name: "myapp",
    safe: true,
    serializers: {
        req: zenlog.stdSerializers.req,
        res: zenlog.stdSerializers.res,
        err: zenlog.stdSerializers.err,
    },
});

zenlog({
    write(o) {},
});

zenlog({
    mixin() {
        return { customName: "unknown", customId: 111 };
    },
});

zenlog({
    mixin: () => ({ customName: "unknown", customId: 111 }),
});

zenlog({
    mixin: (context: object) => ({ customName: "unknown", customId: 111 }),
});

zenlog({
    mixin: (context: object, level: number) => ({ customName: "unknown", customId: 111 }),
});

zenlog({
    redact: { paths: [], censor: "SECRET" },
});

zenlog({
    redact: { paths: [], censor: () => "SECRET" },
});

zenlog({
    redact: { paths: [], censor: (value) => value },
});

zenlog({
    redact: { paths: [], censor: (value, path) => path.join() },
});

zenlog({
    depthLimit: 1
});

zenlog({
    edgeLimit: 1
});

zenlog({
    browser: {
        write(o) {},
    },
});

zenlog({
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

zenlog({}, undefined);

zenlog({ base: null });
if ("zenlog" in log) console.log(`zenlog version: ${log.zenlog}`);

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
zenlog().child({}, { serializers: customSerializers }).info({ test: "should not show up" });
const child2 = log.child({ father: true });
const childChild = child2.child({ baby: true });
const childRedacted = zenlog().child({}, { redact: ["path"] })
childRedacted.info({
  msg: "logged with redacted properties",
  path: "Not shown",
});
const childAnotherRedacted = zenlog().child({}, {
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

zenlog.levels.values.error === 50;
zenlog.levels.labels[50] === "error";

const logstderr: zenlog.Logger = zenlog(process.stderr);
logstderr.error("on stderr instead of stdout");

log.useLevelLabels = true;
log.info("lol");
log.level === "info";
const isEnabled: boolean = log.isLevelEnabled("info");

const redacted = zenlog({
    redact: ["path"],
});

redacted.info({
    msg: "logged with redacted properties",
    path: "Not shown",
});

const anotherRedacted = zenlog({
    redact: {
        paths: ["anotherPath"],
        censor: "Not the log you\re looking for",
    },
});

anotherRedacted.info({
    msg: "another logged with redacted properties",
    anotherPath: "Not shown",
});

const withTimeFn = zenlog({
    timestamp: zenlog.stdTimeFunctions.isoTime,
});

const withNestedKey = zenlog({
    nestedKey: "payload",
});

const withHooks = zenlog({
    hooks: {
        logMethod(args, method, level) {
            expectType<zenlog.Logger>(this);
            return method.apply(this, args);
        },
        streamWrite(s) {
            expectType<string>(s);
            return s.replaceAll('secret-key', 'xxx');
        },
    },
});

// Properties/types imported from pino-std-serializers
const wrappedErrSerializer = zenlog.stdSerializers.wrapErrorSerializer((err: zenlog.SerializedError) => {
    return { ...err, newProp: "foo" };
});
const wrappedReqSerializer = zenlog.stdSerializers.wrapRequestSerializer((req: zenlog.SerializedRequest) => {
    return { ...req, newProp: "foo" };
});
const wrappedResSerializer = zenlog.stdSerializers.wrapResponseSerializer((res: zenlog.SerializedResponse) => {
    return { ...res, newProp: "foo" };
});

const socket = new Socket();
const incomingMessage = new IncomingMessage(socket);
const serverResponse = new ServerResponse(incomingMessage);

const mappedHttpRequest: { req: zenlog.SerializedRequest } = zenlog.stdSerializers.mapHttpRequest(incomingMessage);
const mappedHttpResponse: { res: zenlog.SerializedResponse } = zenlog.stdSerializers.mapHttpResponse(serverResponse);

const serializedErr: zenlog.SerializedError = zenlog.stdSerializers.err(new Error());
const serializedReq: zenlog.SerializedRequest = zenlog.stdSerializers.req(incomingMessage);
const serializedRes: zenlog.SerializedResponse = zenlog.stdSerializers.res(serverResponse);

/**
 * Destination static method
 */
const destinationViaDefaultArgs = zenlog.destination();
const destinationViaStrFileDescriptor = zenlog.destination("/log/path");
const destinationViaNumFileDescriptor = zenlog.destination(2);
const destinationViaStream = zenlog.destination(process.stdout);
const destinationViaOptionsObject = zenlog.destination({ dest: "/log/path", sync: false });

zenlog(destinationViaDefaultArgs);
zenlog({ name: "my-logger" }, destinationViaDefaultArgs);
zenlog(destinationViaStrFileDescriptor);
zenlog({ name: "my-logger" }, destinationViaStrFileDescriptor);
zenlog(destinationViaNumFileDescriptor);
zenlog({ name: "my-logger" }, destinationViaNumFileDescriptor);
zenlog(destinationViaStream);
zenlog({ name: "my-logger" }, destinationViaStream);
zenlog(destinationViaOptionsObject);
zenlog({ name: "my-logger" }, destinationViaOptionsObject);

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

const logLine: zenlog.LogDescriptor = {
    level: 20,
    msg: "A log message",
    time: new Date().getTime(),
    aCustomProperty: true,
};

interface CustomLogger extends zenlog.Logger {
    customMethod(msg: string, ...args: unknown[]): void;
}

const serializerFunc: zenlog.SerializerFn = () => {}
const writeFunc: zenlog.WriteFn = () => {}

interface CustomBaseLogger extends zenlog.BaseLogger {
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
const log3 = zenlog({ customLevels: { myLevel: 100 } })
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

const withChildCallback = zenlog({
    onChild: (child: Logger) => {}
})
withChildCallback.onChild = (child: Logger) => {}

zenlog({
    crlf: true,
});

const customLevels = { foo: 99, bar: 42 }

const customLevelLogger = zenlog({ customLevels });

type CustomLevelLogger = typeof customLevelLogger
type CustomLevelLoggerLevels = zenlog.Level | keyof typeof customLevels

const fn = (logger: Pick<CustomLevelLogger, CustomLevelLoggerLevels>) => {}

const customLevelChildLogger = customLevelLogger.child({ name: "child" })

fn(customLevelChildLogger); // missing foo typing

// unknown option
expectError(
  zenlog({
    hello: 'world'
  })
);

// unknown option
expectError(
  zenlog({
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

const bLogger = zenlog({
  customLevels: {
    log: 5,
  },
  level: 'log',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

expectType<Logger<'log'>>(zenlog({
  customLevels: {
    log: 5,
  },
  level: 'log',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
}))

const parentLogger1 = zenlog({
  customLevels: { myLevel: 90 },
  onChild: (child) => { const a = child.myLevel; }
}, process.stdout)
parentLogger1.onChild = (child) => { child.myLevel(''); }

const childLogger1 = parentLogger1.child({});
childLogger1.myLevel('');
expectError(childLogger1.doesntExist(''));

const parentLogger2 = zenlog({}, process.stdin);
expectError(parentLogger2.onChild = (child) => { const b = child.doesntExist; });

const childLogger2 = parentLogger2.child({});
expectError(childLogger2.doesntExist);

expectError(zenlog({
  onChild: (child) => { const a = child.doesntExist; }
}, process.stdout));

const zenlogWithoutLevelsSorting = zenlog({});
const zenlogWithDescSortingLevels = zenlog({ levelComparison: 'DESC' });
const zenlogWithAscSortingLevels = zenlog({ levelComparison: 'ASC' });
const zenlogWithCustomSortingLevels = zenlog({ levelComparison: () => false });
// with wrong level comparison direction
expectError(zenlog({ levelComparison: 'SOME'}), process.stdout);
// with wrong level comparison type
expectError(zenlog({ levelComparison: 123}), process.stdout);
// with wrong custom level comparison return type
expectError(zenlog({ levelComparison: () => null }), process.stdout);
expectError(zenlog({ levelComparison: () => 1 }), process.stdout);
expectError(zenlog({ levelComparison: () => 'string' }), process.stdout);

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

const loggerWithCustomLevelOnly = zenlog(customLevelsOnlyOpts);
loggerWithCustomLevelOnly.customDebug('test3')
loggerWithCustomLevelOnly.info('test4')
loggerWithCustomLevelOnly.customError('test5')
loggerWithCustomLevelOnly.customNetwork('test6')

expectError(loggerWithCustomLevelOnly.fatal('test'));
expectError(loggerWithCustomLevelOnly.error('test'));
expectError(loggerWithCustomLevelOnly.warn('test'));
expectError(loggerWithCustomLevelOnly.debug('test'));
expectError(loggerWithCustomLevelOnly.trace('test'));
