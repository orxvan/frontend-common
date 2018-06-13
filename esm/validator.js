import { T, always, cond, identity, is, isEmpty, path, pipe, reject, test } from 'ramda';
import { validate } from 'spected';
import { isNilOrEmpty, isNotNilOrEmpty } from './ramda-extra.js';

var renderMsg = function renderMsg(tmpl, arg) {
  return typeof tmpl === 'function' ? tmpl(arg) : tmpl;
};

var rules = {
  match: function match(pattern) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should match: ' + String(pattern);
    return [test(pattern), renderMsg(msg, pattern)];
  },

  minLength: function minLength(length) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should have min length: ' + length;
    return [function (val) {
      return !!val && val.length >= length;
    }, renderMsg(msg, length)];
  },

  notBlank: function notBlank() {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'should not be blank';
    return [isNotNilOrEmpty, msg];
  }
};

var hasNoErrors = function hasNoErrors(results) {
  var shouldExclude = cond([[isNilOrEmpty, T], [is(Object), hasNoErrors]]);
  return pipe(reject(shouldExclude), isEmpty)(results);
};

var defineValidator = function defineValidator(_ref) {
  var spec = _ref.spec;

  var validate$$1 = validate(always(null), identity, spec);

  return {
    allValid: pipe(validate$$1, hasNoErrors),

    checkField: function checkField(path$$1, input) {
      return pipe(validate$$1, path(path$$1))(input);
    },
    checkAll: validate$$1
  };
};

export { defineValidator, rules };
//# sourceMappingURL=validator.js.map
