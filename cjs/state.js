'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _default20 = _interopDefault(require('ramda/src/props'));
var _default19 = _interopDefault(require('ramda/src/append'));
var _default18 = _interopDefault(require('ramda/src/path'));
var _default17 = _interopDefault(require('ramda/src/__'));
var _default16 = _interopDefault(require('ramda/src/curry'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var _default15 = _interopDefault(require('ramda/src/merge'));
var _default14 = _interopDefault(require('ramda/src/over'));
var _default13 = _interopDefault(require('ramda/src/map'));
var _default12 = _interopDefault(require('ramda/src/isEmpty'));
var _default11 = _interopDefault(require('ramda/src/reduce'));
var _default10 = _interopDefault(require('ramda/src/assocPath'));
var _default9 = _interopDefault(require('ramda/src/evolve'));
var _Object$freeze = _interopDefault(require('babel-runtime/core-js/object/freeze'));
var _default8 = _interopDefault(require('ramda/src/assoc'));
var _default7 = _interopDefault(require('ramda/src/lensProp'));
var _default6 = _interopDefault(require('ramda/src/join'));
var _default5 = _interopDefault(require('ramda/src/always'));
var _default4 = _interopDefault(require('ramda/src/head'));
var _default3 = _interopDefault(require('ramda/src/ifElse'));
var _default2 = _interopDefault(require('ramda/src/concat'));
var _default = _interopDefault(require('ramda/src/pipe'));
var camelCase = _interopDefault(require('lodash/camelCase'));
var reduxActions = require('redux-actions');
var reselect = require('reselect');
var __ramdaExtra_js = require('./ramda-extra.js');
var __validator_js = require('./validator.js');

var withPrefix = _default(__ramdaExtra_js.argList, _default3(_default(_default4, __ramdaExtra_js.isNilOrEmpty), _default5(''), _default6('')), _default2);

var reducerLens = _default7('reducers');
var selectorLens = _default7('selectors');

var DEFAULT_OPTIONS = {
  namespace: {
    domain: '',
    path: []
  },
  initial: {},
  actions: {},
  reducers: {},
  selectors: {}
};

var initial = function initial(state) {
  return _default8('initial', _Object$freeze(state));
};
var withNamespace = function withNamespace(ns) {
  return _default9({ namespace: __ramdaExtra_js.override(ns) });
};

var defineAction = function defineAction(_ref, name) {
  var domain = _ref.domain;
  return _default10(['actions', camelCase(name)], reduxActions.createAction(withPrefix(domain, '/')(name)));
};

var actionGroup = function actionGroup(prefix, names) {
  return function (config) {
    return _default11(function (acc, name) {
      return defineAction(config.namespace, name)(acc);
    }, config, _default12(prefix) ? names : _default13(withPrefix(prefix, '_'), names));
  };
};

var handle = function handle(makeHandlers) {
  return function (config) {
    return _default14(reducerLens, __ramdaExtra_js.override(makeHandlers(config)), config);
  };
};

var handleListActions = function handleListActions(_ref2) {
  var _ref5;

  var actions = _ref2.actions;
  return _ref5 = {}, _defineProperty(_ref5, actions.listPending, __ramdaExtra_js.override({ error: null, pending: true })), _defineProperty(_ref5, actions.listComplete, {
    next: function next(state, _ref3) {
      var items = _ref3.payload;

      var _normalizeBy = __ramdaExtra_js.normalizeBy('id', items),
          ids = _normalizeBy.keys,
          itemsMap = _normalizeBy.itemsByKey;

      return _default15(state, { error: null, pending: false, ids: ids, itemsMap: itemsMap });
    },

    throw: function _throw(state, _ref4) {
      var error = _ref4.payload;
      return _default15(state, { error: error, pending: false });
    }
  }), _ref5;
};

var handleFormActions = function handleFormActions(_ref6) {
  var _ref9;

  var actions = _ref6.actions,
      initialState = _ref6.initial,
      validator = _ref6.validator;
  return _ref9 = {}, _defineProperty(_ref9, actions.formInput, function (state, _ref7) {
    var payload = _ref7.payload;

    var path = payload.field.split('.');
    var fields = _default10(path, payload.value, state.fields);
    var errors = validator.checkField(path, fields);
    var fieldErrors = _default10(path, errors, state.fieldErrors);
    return _default15(state, { fields: fields, fieldErrors: fieldErrors });
  }), _defineProperty(_ref9, actions.formReset, _default5(initialState)), _defineProperty(_ref9, actions.formSubmitPending, __ramdaExtra_js.override({ error: null, pending: true })), _defineProperty(_ref9, actions.formSubmitComplete, {
    next: _default5(initialState),
    throw: function _throw(state, _ref8) {
      var error = _ref8.payload;
      return _default15(state, { error: error, pending: false });
    }
  }), _ref9;
};

var select = function select(makeSelectors) {
  return function (config) {
    return _default14(selectorLens, __ramdaExtra_js.override(makeSelectors(config)), config);
  };
};

var defineReducers = function defineReducers(config) {
  return _default14(reducerLens, _default16(reduxActions.handleActions)(_default17, config.initial), config);
};

var define$1 = function define$$1(namespace, builders) {
  return _default(_default2([withNamespace(namespace), select(function (_ref10) {
    var ns = _ref10.namespace;
    return {
      getState: _default18(ns.path),
      getStateProp: function getStateProp(key) {
        return _default18(_default19(key, ns.path));
      }
    };
  })]), _default11(function (config, builder) {
    return builder(config);
  }, DEFAULT_OPTIONS), defineReducers)(builders);
};

var makeForm = function makeForm(namespace) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extraBuilders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return define$1(namespace, _default2([initial({
    error: null,
    fields: options.fields,
    fieldErrors: {},
    pending: false
  }), actionGroup('FORM', ['INPUT', 'RESET']), actionGroup('FORM_SUBMIT', ['REQUESTED', 'PENDING', 'COMPLETE']), _default8('validator', options.validator || __validator_js.define({ spec: {} })), handle(handleFormActions), select(function (_ref11) {
    var selectors = _ref11.selectors,
        validator = _ref11.validator;
    var getStateProp = selectors.getStateProp;


    return {
      getError: getStateProp('error'),
      getFields: getStateProp('fields'),
      getFieldErrors: getStateProp('fieldErrors'),
      isPending: getStateProp('pending'),
      isValid: _default(getStateProp('fields'), validator.allValid)
    };
  })], extraBuilders));
};

var makeList = function makeList(namespace) {
  var extraBuilders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return define$1(namespace, _default2([initial({ error: null, ids: [], itemsMap: {}, pending: false }), actionGroup('LIST', ['REQUESTED', 'PENDING', 'COMPLETE']), handle(handleListActions), select(function (_ref12) {
    var selectors = _ref12.selectors;
    var getStateProp = selectors.getStateProp;


    var basic = {
      getError: getStateProp('error'),
      getIds: getStateProp('ids'),
      getItemsMap: getStateProp('itemsMap'),
      isPending: getStateProp('pending')
    };

    var computed = {
      getItems: reselect.createSelector([basic.getIds, basic.getItemsMap], _default20)
    };

    return _default15(basic, computed);
  })], extraBuilders));
};

exports.actionGroup = actionGroup;
exports.define = define$1;
exports.handle = handle;
exports.initial = initial;
exports.makeForm = makeForm;
exports.makeList = makeList;
exports.select = select;
//# sourceMappingURL=state.js.map
