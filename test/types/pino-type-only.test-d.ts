import { expectAssignable, expectType } from "tsd";

import bingo from "../../";
import type {LevelWithSilent, Logger, LogFn, P} from "../../bingo";

// NB: can also use `import * as bingo`, but that form is callable as `bingo()`
// under `esModuleInterop: false` or `bingo.default()` under `esModuleInterop: true`.
const log = bingo();
expectType<Logger>(log);
expectType<LogFn>(log.info);

expectType<P.Logger>(log);
expectType<P.LogFn>(log.info);

const level: LevelWithSilent = 'silent';
expectAssignable<P.LevelWithSilent>(level);
