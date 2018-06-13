'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var R = require('ramda');

var argList = R.unapply(R.identity);
var override = R.flip(R.merge);

var isNilOrEmpty = R.either(R.isNil, R.isEmpty);
var isNotNil = R.complement(R.isNil);
var isNotEmpty = R.complement(R.isEmpty);

function isNotNilOrEmpty(value) {
  if (R.isNil(value)) {
    return false;
  }

  if (R.is(Object, value) || R.is(String, value)) {
    return !R.isEmpty(value);
  }

  return true;
}

var extractKey = function extractKey(key) {
  return R.pipe(R.prop(key), R.toString);
};

function normalizeBy(key, items) {
  var keys = R.pluck(key, items);
  var itemsByKey = R.indexBy(extractKey(key), items);
  return { keys: keys, itemsByKey: itemsByKey };
}

var DEFAULT_ENUM_OPTIONS = {
  keyFn: R.identity,
  valueFn: R.identity
};

function defineEnums(options, keys) {
  var _R$merge = R.merge(DEFAULT_ENUM_OPTIONS, options || {}),
      keyFn = _R$merge.keyFn,
      valueFn = _R$merge.valueFn;

  return R.reduce(function (acc, key) {
    return R.assoc(keyFn(key), valueFn(key), acc);
  }, {}, keys || []);
}

var defineEnumsCurried = R.curryN(2, defineEnums);

exports.argList = argList;
exports.defineEnums = defineEnumsCurried;
exports.isNilOrEmpty = isNilOrEmpty;
exports.isNotEmpty = isNotEmpty;
exports.isNotNil = isNotNil;
exports.isNotNilOrEmpty = isNotNilOrEmpty;
exports.normalizeBy = normalizeBy;
exports.override = override;
//# sourceMappingURL=ramda-extra.js.map
