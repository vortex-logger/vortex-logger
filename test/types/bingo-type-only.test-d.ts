import { expectAssignable, expectType, expectNotAssignable } from "tsd";

import bingo from "../../bingo-logger";
import type {LevelWithSilent, Logger, LogFn, P, DestinationStreamWithMetadata,  Level, LevelOrString, LevelWithSilentOrString, LoggerExtras, LoggerOptions } from "../../bingo-logger";

// NB: can also use `import * as bingo`, but that form is callable as `bingo()`
// under `esModuleInterop: false` or `bingo.default()` under `esModuleInterop: true`.
const log = bingo();
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
expectNotAssignable<bingo.Level>(levelOrString);
expectNotAssignable<bingo.LevelWithSilent>(levelOrString);
expectAssignable<bingo.LevelWithSilentOrString>(levelOrString);

const levelWithSilentOrString: LevelWithSilentOrString = "myCustomLevel";
expectAssignable<string>(levelWithSilentOrString);
expectNotAssignable<bingo.Level>(levelWithSilentOrString);
expectNotAssignable<bingo.LevelWithSilent>(levelWithSilentOrString);
expectAssignable<bingo.LevelOrString>(levelWithSilentOrString);

function createStream(): DestinationStreamWithMetadata {
    return { write() {} };
}

const stream = createStream();
// Argh. TypeScript doesn't seem to narrow unless we assign the symbol like so, and tsd seems to
// break without annotating the type explicitly
const needsMetadata: typeof bingo.symbols.needsMetadataGsym = bingo.symbols.needsMetadataGsym;
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
