'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _Symbol = _interopDefault(require('babel-runtime/core-js/symbol'));
var debug = _interopDefault(require('debug'));
var R = require('ramda');

var is$1 = R.is;
var isEmpty$1 = R.isEmpty;

var log = debug('ein:common:style-set');

var isSymbol = R.either(R.is(_Symbol), R.pipe(R.type, R.equals('Symbol')));

var isBlank = R.cond([[is$1(String), function (s) {
  return isEmpty$1(s.trim());
}], [R.T, R.either(isEmpty$1, R.isNil)]]);

var rejectBlank = R.reject(isBlank);

var StyleSet = function () {
  function StyleSet(blockName, styles) {
    _classCallCheck(this, StyleSet);

    this.blockName = blockName;
    this.styles = styles;
  }

  _createClass(StyleSet, [{
    key: 'block',
    value: function block() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._join({ args: args, baseName: this.blockName });
    }
  }, {
    key: 'elem',
    value: function elem(name) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this._join({ args: args, baseName: this.blockName + '__' + name });
    }
  }, {
    key: '_lookup',
    value: function _lookup(name) {
      if (!(name in this.styles)) {
        log('unknown class name:', name);
      }
      return this.styles[name] || '';
    }
  }, {
    key: '_getReducer',
    value: function _getReducer(baseName) {
      var _this = this;

      var prefix = baseName.length > 0 ? baseName + '--' : '';

      return function (acc, arg) {
        var name = '' + prefix + arg;

        if (arg.startsWith('!')) {
          acc.globals.push(arg.slice(1));
        } else {
          acc.locals.push(_this._lookup(name));
        }

        return acc;
      };
    }
  }, {
    key: '_join',
    value: function _join(_ref) {
      var _ref$args = _ref.args,
          args = _ref$args === undefined ? [] : _ref$args,
          _ref$baseName = _ref.baseName,
          baseName = _ref$baseName === undefined ? '' : _ref$baseName;

      var _R$pipe = R.pipe(StyleSet.flattenClasses, rejectBlank, R.reduce(this._getReducer(baseName), {
        globals: [],
        locals: [this._lookup(baseName)]
      }))(args),
          globals = _R$pipe.globals,
          locals = _R$pipe.locals;

      return rejectBlank(globals.concat(locals)).join(' ');
    }
  }]);

  return StyleSet;
}();

StyleSet.flattenClasses = R.chain(R.cond([[is$1(String), R.identity], [isSymbol, R.pipe(R.toString, R.slice('Symbol('.length, -1))], [is$1(Array), R.identity], [is$1(Object), R.pipe(R.filter(R.identity), R.keys)]]));

StyleSet.join = R.unapply(R.pipe(StyleSet.flattenClasses, rejectBlank, R.join(' ')));

module.exports = StyleSet;
//# sourceMappingURL=style-set.js.map
