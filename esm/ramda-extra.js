import { assoc, complement, curryN, either, flip, identity, indexBy, is, isEmpty, isNil, merge, pipe, pluck, prop, reduce, toString, unapply } from 'ramda';

var argList = unapply(identity);
var override = flip(merge);

var isNilOrEmpty = either(isNil, isEmpty);
var isNotNil = complement(isNil);
var isNotEmpty = complement(isEmpty);

function isNotNilOrEmpty(value) {
  if (isNil(value)) {
    return false;
  }

  if (is(Object, value) || is(String, value)) {
    return !isEmpty(value);
  }

  return true;
}

var extractKey = function extractKey(key) {
  return pipe(prop(key), toString);
};

function normalizeBy(key, items) {
  var keys = pluck(key, items);
  var itemsByKey = indexBy(extractKey(key), items);
  return { keys: keys, itemsByKey: itemsByKey };
}

var DEFAULT_ENUM_OPTIONS = {
  keyFn: identity,
  valueFn: identity
};

function defineEnums(options, keys) {
  var _R$merge = merge(DEFAULT_ENUM_OPTIONS, options || {}),
      keyFn = _R$merge.keyFn,
      valueFn = _R$merge.valueFn;

  return reduce(function (acc, key) {
    return assoc(keyFn(key), valueFn(key), acc);
  }, {}, keys || []);
}

var defineEnumsCurried = curryN(2, defineEnums);

export { argList, defineEnumsCurried as defineEnums, isNilOrEmpty, isNotEmpty, isNotNil, isNotNilOrEmpty, normalizeBy, override };
//# sourceMappingURL=ramda-extra.js.map
