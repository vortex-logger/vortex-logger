import { expectType } from "tsd";

import bingo from '../../bingo-logger';
import { bingo as bingoNamed, P } from "../../bingo-logger";
import * as bingoStar from "../../bingo-logger";
import bingoCjsImport = require ("../../bingo-logger");
const bingoCjs = require("../../bingo-logger");
const { P: bingoCjsNamed } = require('bingo')

const log = bingo();
expectType<P.LogFn>(log.info);
expectType<P.LogFn>(log.error);

expectType<bingo.Logger>(bingoNamed());
expectType<P.Logger>(bingoNamed());
expectType<bingo.Logger>(bingoStar.default());
expectType<bingo.Logger>(bingoStar.bingo());
expectType<bingo.Logger>(bingoCjsImport.default());
expectType<bingo.Logger>(bingoCjsImport.bingo());
expectType<any>(bingoCjsNamed());
expectType<any>(bingoCjs());

const levelChangeEventListener: P.LevelChangeEventListener = (
    lvl: P.LevelWithSilent | string,
    val: number,
    prevLvl: P.LevelWithSilent | string,
    prevVal: number,
) => {}
expectType<P.LevelChangeEventListener>(levelChangeEventListener)
