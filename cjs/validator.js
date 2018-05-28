'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var R = require('ramda');
var spected = require('spected');
var ramdaExtra_js = require('./ramda-extra.js');

var renderMsg = function renderMsg(tmpl, arg) {
  return R.is(Function, tmpl) ? tmpl(arg) : tmpl;
};

var rules = {
  match: function match(pattern) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should match: ' + pattern;
    return [R.test(pattern), renderMsg(msg, pattern)];
  },

  minLength: function minLength(length$$1) {
    var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'should have min length: ' + length$$1;
    return [R.pipe(R.length, R.gte(R.__, length$$1)), renderMsg(msg, length$$1)];
  },

  notBlank: function notBlank() {
    var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'should not be blank';
    return [ramdaExtra_js.isNotNilOrEmpty, msg];
  }
};

var hasNoErrors = function hasNoErrors(results) {
  var shouldExclude = R.cond([[ramdaExtra_js.isNilOrEmpty, R.T], [R.is(Object), hasNoErrors]]);
  return R.pipe(R.reject(shouldExclude), R.isEmpty)(results);
};

var defineValidator = function defineValidator(_ref) {
  var spec = _ref.spec;

  var validate$$1 = spected.validate(R.always(null), R.identity, spec);

  return {
    allValid: R.pipe(validate$$1, hasNoErrors),
    checkField: function checkField(path$$1, input) {
      return R.pipe(validate$$1, R.path(path$$1))(input);
    },
    checkAll: validate$$1
  };
};

exports.defineValidator = defineValidator;
exports.rules = rules;
//# sourceMappingURL=validator.js.map
