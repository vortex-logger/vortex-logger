'use strict'

const setLevelSym = Symbol('bingo.setLevel')
const getLevelSym = Symbol('bingo.getLevel')
const levelValSym = Symbol('bingo.levelVal')
const levelCompSym = Symbol('bingo.levelComp')
const useLevelLabelsSym = Symbol('bingo.useLevelLabels')
const useOnlyCustomLevelsSym = Symbol('bingo.useOnlyCustomLevels')
const mixinSym = Symbol('bingo.mixin')

const lsCacheSym = Symbol('bingo.lsCache')
const chindingsSym = Symbol('bingo.chindings')

const asJsonSym = Symbol('bingo.asJson')
const writeSym = Symbol('bingo.write')
const redactFmtSym = Symbol('bingo.redactFmt')

const timeSym = Symbol('bingo.time')
const timeSliceIndexSym = Symbol('bingo.timeSliceIndex')
const streamSym = Symbol('bingo.stream')
const stringifySym = Symbol('bingo.stringify')
const stringifySafeSym = Symbol('bingo.stringifySafe')
const stringifiersSym = Symbol('bingo.stringifiers')
const endSym = Symbol('bingo.end')
const formatOptsSym = Symbol('bingo.formatOpts')
const messageKeySym = Symbol('bingo.messageKey')
const errorKeySym = Symbol('bingo.errorKey')
const nestedKeySym = Symbol('bingo.nestedKey')
const nestedKeyStrSym = Symbol('bingo.nestedKeyStr')
const mixinMergeStrategySym = Symbol('bingo.mixinMergeStrategy')
const msgPrefixSym = Symbol('bingo.msgPrefix')

const wildcardFirstSym = Symbol('bingo.wildcardFirst')

// public symbols, no need to use the same bingo
// version for these
const serializersSym = Symbol.for('bingo.serializers')
const formattersSym = Symbol.for('bingo.formatters')
const hooksSym = Symbol.for('bingo.hooks')
const needsMetadataGsym = Symbol.for('bingo.metadata')

module.exports = {
  setLevelSym,
  getLevelSym,
  levelValSym,
  levelCompSym,
  useLevelLabelsSym,
  mixinSym,
  lsCacheSym,
  chindingsSym,
  asJsonSym,
  writeSym,
  serializersSym,
  redactFmtSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  errorKeySym,
  nestedKeySym,
  wildcardFirstSym,
  needsMetadataGsym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym,
  msgPrefixSym
}
