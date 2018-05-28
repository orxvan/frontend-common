import { assoc, both, complement, curryN, either, flip, identity, indexBy, isEmpty, isNil, merge, pluck, prop, reduce, unapply } from 'ramda';

var argList = unapply(identity);
var override = flip(merge);

var isNilOrEmpty = either(isNil, isEmpty);
var isNotNil = complement(isNil);
var isNotEmpty = complement(isEmpty);
var isNotNilOrEmpty = both(isNotNil, isNotEmpty);

var normalizeBy = function normalizeBy(key, items) {
  var keys = pluck(key, items);
  var itemsByKey = indexBy(prop(key), items);
  return { keys: keys, itemsByKey: itemsByKey };
};

var DEFAULT_ENUM_OPTIONS = {
  keyFn: identity,
  valueFn: identity
};

var defineEnums = curryN(2, function (options, keys) {
  var _R$merge = merge(DEFAULT_ENUM_OPTIONS, options || {}),
      keyFn = _R$merge.keyFn,
      valueFn = _R$merge.valueFn;

  return reduce(function (acc, key) {
    return assoc(keyFn(key), valueFn(key), acc);
  }, {}, keys || []);
});

export { argList, override, isNilOrEmpty, isNotNil, isNotEmpty, isNotNilOrEmpty, normalizeBy, defineEnums };
//# sourceMappingURL=ramda-extra.js.map
