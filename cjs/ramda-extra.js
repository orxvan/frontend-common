'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var R = require('ramda');

var argList = R.unapply(R.identity);
var override = R.flip(R.merge);

var isNilOrEmpty = R.either(R.isNil, R.isEmpty);
var isNotNil = R.complement(R.isNil);
var isNotEmpty = R.complement(R.isEmpty);
var isNotNilOrEmpty = R.both(isNotNil, isNotEmpty);

var normalizeBy = function normalizeBy(key, items) {
  var keys = R.pluck(key, items);
  var itemsByKey = R.indexBy(R.prop(key), items);
  return { keys: keys, itemsByKey: itemsByKey };
};

var DEFAULT_ENUM_OPTIONS = {
  keyFn: R.identity,
  valueFn: R.identity
};

var defineEnums = R.curryN(2, function (options, keys) {
  var _R$merge = R.merge(DEFAULT_ENUM_OPTIONS, options || {}),
      keyFn = _R$merge.keyFn,
      valueFn = _R$merge.valueFn;

  return R.reduce(function (acc, key) {
    return R.assoc(keyFn(key), valueFn(key), acc);
  }, {}, keys || []);
});

exports.argList = argList;
exports.override = override;
exports.isNilOrEmpty = isNilOrEmpty;
exports.isNotNil = isNotNil;
exports.isNotEmpty = isNotEmpty;
exports.isNotNilOrEmpty = isNotNilOrEmpty;
exports.normalizeBy = normalizeBy;
exports.defineEnums = defineEnums;
//# sourceMappingURL=ramda-extra.js.map
