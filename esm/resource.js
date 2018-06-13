import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import axios from 'axios';
import debug from 'debug';
import { assoc, assocPath, pipe, prop, reduce, replace, tap, values } from 'ramda';

var _this = undefined;

var log = debug('ein:common:resource');

var normalizeURL = pipe(replace(/\/+$/, ''), replace(/^/, '/'), replace(/\/+/g, '/'));

var withBaseURL = function withBaseURL() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  return assoc('baseURL', normalizeURL(url));
};

var defineEndpoint = function defineEndpoint(name, makeImpl) {
  return function (config) {
    return assocPath(['endpoints', name], { name: name, impl: makeImpl(config) }, config);
  };
};

var methods = {
  list: function list() {
    return defineEndpoint('list', function (_ref) {
      var baseURL = _ref.baseURL,
          http = _ref.http;
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
                return _context.abrupt('return', resp.data);

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
    return defineEndpoint('create', function (_ref3) {
      var baseURL = _ref3.baseURL,
          http = _ref3.http;
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
                return _context2.abrupt('return', resp.data);

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
    return defineEndpoint('get', function (_ref5) {
      var baseURL = _ref5.baseURL,
          http = _ref5.http;
      return function () {
        var _ref6 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(id) {
          var resp;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return http.get(baseURL + '/' + String(id));

                case 2:
                  resp = _context3.sent;
                  return _context3.abrupt('return', resp.data);

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x4) {
          return _ref6.apply(this, arguments);
        };
      }();
    });
  },

  update: function update() {
    return defineEndpoint('update', function (_ref7) {
      var baseURL = _ref7.baseURL,
          http = _ref7.http;
      return function () {
        var _ref8 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(id, data) {
          var resp;
          return _regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return http.put(baseURL + '/' + String(id), data);

                case 2:
                  resp = _context4.sent;
                  return _context4.abrupt('return', resp.data);

                case 4:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, _this);
        }));

        return function (_x5, _x6) {
          return _ref8.apply(this, arguments);
        };
      }();
    });
  },

  delete: function _delete() {
    return defineEndpoint('delete', function (_ref9) {
      var baseURL = _ref9.baseURL,
          http = _ref9.http;
      return function () {
        var _ref10 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(id) {
          return _regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return http.delete(baseURL + '/' + String(id));

                case 2:
                  return _context5.abrupt('return', true);

                case 3:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this);
        }));

        return function (_x7) {
          return _ref10.apply(this, arguments);
        };
      }();
    });
  },

  custom: defineEndpoint
};

var withHttp = function withHttp(client) {
  return assoc('http', client);
};

var DEFAULT_CONFIG = {
  baseURL: '/',
  endpoints: {},
  http: axios.create({
    headers: { 'Content-Type': 'application/json' }
  })
};

var defineResourceMethod = function defineResourceMethod(resource, endpoint) {
  return assoc(endpoint.name, endpoint.impl, resource);
};

var defineResource = pipe(reduce(function (config, builder) {
  return builder(config);
}, DEFAULT_CONFIG), tap(function (config) {
  return log('defineResource:', config);
}), prop('endpoints'), values, reduce(defineResourceMethod, {}));

export { methods, defineResource, withBaseURL, withHttp };
//# sourceMappingURL=resource.js.map
