'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var axios = _interopDefault(require('axios'));
var debug = _interopDefault(require('debug'));
var R = require('ramda');

var _this = undefined;

var isFunction = R.is(Function);
var log = debug('ein:common:resource');

var normalizeURL = R.pipe(R.replace(/\/+$/, ''), R.replace(/^/, '/'), R.replace(/\/+/g, '/'));

var withBaseURL = function withBaseURL() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  return R.assoc('baseURL', normalizeURL(url));
};

var defineEndpoint = function defineEndpoint(name, makeImpl) {
  return function (config) {
    return R.assocPath(['endpoints', name], { name: name, impl: makeImpl(config) }, config);
  };
};

var selectResponse = function selectResponse(selector, _ref) {
  var data = _ref.data;
  return isFunction(selector) ? selector(data) : data;
};

var methods = {
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return defineEndpoint('list', function (_ref2) {
      var baseURL = _ref2.baseURL,
          http = _ref2.http;
      return _asyncToGenerator(_regeneratorRuntime.mark(function _callee() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var resp;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return http.get(baseURL + '/', { params: params });

              case 2:
                resp = _context.sent;
                return _context.abrupt('return', selectResponse(options.selector, resp));

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));
    });
  },

  create: function create() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return defineEndpoint('create', function (_ref4) {
      var baseURL = _ref4.baseURL,
          http = _ref4.http;
      return _asyncToGenerator(_regeneratorRuntime.mark(function _callee2() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var resp;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return http.post(baseURL + '/', data);

              case 2:
                resp = _context2.sent;
                return _context2.abrupt('return', selectResponse(options.selector, resp));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));
    });
  },

  get: function get() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return defineEndpoint('get', function (_ref6) {
      var baseURL = _ref6.baseURL,
          http = _ref6.http;
      return function () {
        var _ref7 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(id) {
          var resp;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return http.get(baseURL + '/' + id);

                case 2:
                  resp = _context3.sent;
                  return _context3.abrupt('return', selectResponse(options.selector, resp));

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x7) {
          return _ref7.apply(this, arguments);
        };
      }();
    });
  },

  update: function update() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return defineEndpoint('update', function (_ref8) {
      var baseURL = _ref8.baseURL,
          http = _ref8.http;
      return function () {
        var _ref9 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(id, data) {
          var resp;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return http.put(baseURL + '/' + id, data);

                case 2:
                  resp = _context4.sent;
                  return _context4.abrupt('return', selectResponse(options.selector, resp));

                case 4:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this);
        }));

        return function (_x9, _x10) {
          return _ref9.apply(this, arguments);
        };
      }();
    });
  },

  delete: function _delete() {
    return defineEndpoint('delete', function (_ref10) {
      var baseURL = _ref10.baseURL,
          http = _ref10.http;
      return function () {
        var _ref11 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(id) {
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return http.delete(baseURL + '/' + id);

                case 2:
                  return _context5.abrupt('return', true);

                case 3:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this);
        }));

        return function (_x11) {
          return _ref11.apply(this, arguments);
        };
      }();
    });
  },

  custom: defineEndpoint
};

var withHttp = function withHttp(client) {
  return R.assoc('http', client);
};

var DEFAULT_OPTIONS = {
  baseURL: '/',
  endpoints: {},
  http: axios.create({
    headers: { 'Content-Type': 'application/json' }
  })
};

var defineResourceMethod = function defineResourceMethod(resource, endpoint) {
  return R.assoc(endpoint.name, endpoint.impl, resource);
};

var defineResource = R.pipe(R.reduce(function (config, builder) {
  return builder(config);
}, DEFAULT_OPTIONS), R.tap(function (config) {
  return log('defineResource:', config);
}), R.prop('endpoints'), R.values, R.reduce(defineResourceMethod, {}));

exports.methods = methods;
exports.defineResource = defineResource;
exports.withBaseURL = withBaseURL;
exports.withHttp = withHttp;
//# sourceMappingURL=resource.js.map
