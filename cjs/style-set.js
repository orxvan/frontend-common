'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _Symbol = _interopDefault(require('babel-runtime/core-js/symbol'));
var debug = _interopDefault(require('debug'));
var R = require('ramda');
var ramdaExtra_js = require('./ramda-extra.js');

var log = debug('ein:common:style-set');

var isSymbol = function isSymbol(value) {
  return R.is(_Symbol, value) || R.type(value) === 'Symbol';
};

var symbolToString = R.pipe(R.toString, R.slice('Symbol('.length, -1));
var extractTruthyKeys = R.pipe(R.filter(function (v) {
  return !!v;
}), R.keys);

var isBlank = R.cond([[R.is(String), function (s) {
  return R.isEmpty(s.trim());
}], [R.T, ramdaExtra_js.isNilOrEmpty]]);

var rejectBlank = R.reject(isBlank);

var StyleSet = function () {
  _createClass(StyleSet, null, [{
    key: 'flattenClasses',
    value: function flattenClasses(classes) {
      var rv = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(classes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          if (typeof name === 'string') {
            rv.push(name);
          } else if (isSymbol(name)) {
            rv.push(symbolToString(name));
          } else if (Array.isArray(name)) {
            var xs = name.map(function (s) {
              return isSymbol(s) ? symbolToString(s) : String(s);
            });
            rv = R.concat(rv, xs);
          } else if (R.is(Object, name) && !!name) {
            rv = R.concat(rv, extractTruthyKeys(name));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return rv;
    }
  }, {
    key: 'join',
    value: function join$$1() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return R.pipe(StyleSet.flattenClasses, rejectBlank, R.join(' '))(args);
    }
  }]);

  function StyleSet(blockName, styles) {
    _classCallCheck(this, StyleSet);

    this.blockName = blockName;
    this.styles = styles;
  }

  _createClass(StyleSet, [{
    key: 'block',
    value: function block() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this._join({ args: args, baseName: this.blockName });
    }
  }, {
    key: 'elem',
    value: function elem(name) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
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

module.exports = StyleSet;
//# sourceMappingURL=style-set.js.map
