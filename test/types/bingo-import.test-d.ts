import { expectType } from "tsd";

import bingo from '../../bingo-logger';
import { bingo as pinoNamed, P } from "../../bingo-logger";
import * as pinoStar from "../../bingo-logger";
import pinoCjsImport = require ("../../bingo-logger");
const pinoCjs = require("../../bingo-logger");
const { P: pinoCjsNamed } = require('bingo')

const log = bingo();
expectType<P.LogFn>(log.info);
expectType<P.LogFn>(log.error);

expectType<bingo.Logger>(pinoNamed());
expectType<P.Logger>(pinoNamed());
expectType<bingo.Logger>(pinoStar.default());
expectType<bingo.Logger>(pinoStar.bingo());
expectType<bingo.Logger>(pinoCjsImport.default());
expectType<bingo.Logger>(pinoCjsImport.bingo());
expectType<any>(pinoCjsNamed());
expectType<any>(pinoCjs());

const levelChangeEventListener: P.LevelChangeEventListener = (
    lvl: P.LevelWithSilent | string,
    val: number,
    prevLvl: P.LevelWithSilent | string,
    prevVal: number,
) => {}
expectType<P.LevelChangeEventListener>(levelChangeEventListener)
