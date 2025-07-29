import { expectAssignable, expectType, expectNotAssignable } from "tsd";

import zenlog from "../../zenlog";
import type {LevelWithSilent, Logger, LogFn, P, DestinationStreamWithMetadata,  Level, LevelOrString, LevelWithSilentOrString, LoggerExtras, LoggerOptions } from "../../zenlog";

// NB: can also use `import * as zenlog`, but that form is callable as `zenlog()`
// under `esModuleInterop: false` or `zenlog.default()` under `esModuleInterop: true`.
const log = zenlog();
expectAssignable<LoggerExtras>(log);
expectType<Logger>(log);
expectType<LogFn>(log.info);

expectType<P.Logger>(log);
expectType<P.LogFn>(log.info);

expectType<Parameters<typeof log.isLevelEnabled>>([log.level]);

const level: Level = 'debug';
expectAssignable<string>(level);
expectAssignable<P.Level>(level);

const levelWithSilent: LevelWithSilent = 'silent';
expectAssignable<string>(levelWithSilent);
expectAssignable<P.LevelWithSilent>(levelWithSilent);

const levelOrString: LevelOrString = "myCustomLevel";
expectAssignable<string>(levelOrString);
expectNotAssignable<zenlog.Level>(levelOrString);
expectNotAssignable<zenlog.LevelWithSilent>(levelOrString);
expectAssignable<zenlog.LevelWithSilentOrString>(levelOrString);

const levelWithSilentOrString: LevelWithSilentOrString = "myCustomLevel";
expectAssignable<string>(levelWithSilentOrString);
expectNotAssignable<zenlog.Level>(levelWithSilentOrString);
expectNotAssignable<zenlog.LevelWithSilent>(levelWithSilentOrString);
expectAssignable<zenlog.LevelOrString>(levelWithSilentOrString);

function createStream(): DestinationStreamWithMetadata {
    return { write() {} };
}

const stream = createStream();
// Argh. TypeScript doesn't seem to narrow unless we assign the symbol like so, and tsd seems to
// break without annotating the type explicitly
const needsMetadata: typeof zenlog.symbols.needsMetadataGsym = zenlog.symbols.needsMetadataGsym;
if (stream[needsMetadata]) {
    expectType<number>(stream.lastLevel);
}

const loggerOptions:LoggerOptions = {
    browser: {
        formatters: {
            log(obj) {
                return obj
            },
            level(label, number) {
                return { label, number}
            }

        }
    }
}

expectType<LoggerOptions>(loggerOptions)
