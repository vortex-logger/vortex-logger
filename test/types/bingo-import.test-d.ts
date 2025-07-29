import { expectType } from "tsd";

import zenlog from '../../zenlog';
import { zenlog as zenlogNamed, P } from "../../zenlog";
import * as zenlogStar from "../../zenlog";
import zenlogCjsImport = require ("../../zenlog");
const zenlogCjs = require("../../zenlog");
const { P: zenlogCjsNamed } = require('zenlog')

const log = zenlog();
expectType<P.LogFn>(log.info);
expectType<P.LogFn>(log.error);

expectType<zenlog.Logger>(zenlogNamed());
expectType<P.Logger>(zenlogNamed());
expectType<zenlog.Logger>(zenlogStar.default());
expectType<zenlog.Logger>(zenlogStar.zenlog());
expectType<zenlog.Logger>(zenlogCjsImport.default());
expectType<zenlog.Logger>(zenlogCjsImport.zenlog());
expectType<any>(zenlogCjsNamed());
expectType<any>(zenlogCjs());

const levelChangeEventListener: P.LevelChangeEventListener = (
    lvl: P.LevelWithSilent | string,
    val: number,
    prevLvl: P.LevelWithSilent | string,
    prevVal: number,
) => {}
expectType<P.LevelChangeEventListener>(levelChangeEventListener)
