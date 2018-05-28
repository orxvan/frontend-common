'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Object$freeze = _interopDefault(require('babel-runtime/core-js/object/freeze'));
var camelCase = _interopDefault(require('lodash/camelCase'));
var R = require('ramda');
var reduxActions = require('redux-actions');
var ramdaExtra_js = require('../ramda-extra.js');
var debug = _interopDefault(require('debug'));
var _defineProperty = _interopDefault(require('babel-runtime/helpers/defineProperty'));
var validator_js = require('../validator.js');
var reselect = require('reselect');

var withPrefix = R.pipe(ramdaExtra_js.argList, R.ifElse(R.pipe(R.head, ramdaExtra_js.isNilOrEmpty), R.always(''), R.join('')), R.concat);

var reducerLens = R.lensProp('reducers');
var selectorLens = R.lensProp('selectors');

var initial = function initial(state) {
  return R.assoc('initial', _Object$freeze(state));
};

var action = function action(ns, name) {
  return R.assocPath(['actions', camelCase(name)], reduxActions.createAction(withPrefix(R.join('/', ns), '/')(name)));
};

var actionGroup = function actionGroup(prefix, names) {
  return function (config) {
    return R.reduce(function (acc, name) {
      return action(config.namespace, name)(acc);
    }, config, R.isEmpty(prefix) ? names : R.map(withPrefix(prefix, '_'), names));
  };
};

var handle = function handle(makeHandlers) {
  return function (config) {
    return R.over(reducerLens, ramdaExtra_js.override(makeHandlers(config)), config);
  };
};

var select = function select(makeSelectors) {
  return function (config) {
    return R.over(selectorLens, ramdaExtra_js.override(makeSelectors(config)), config);
  };
};

var log = debug('ein:common:redux:core');

var DEFAULT_OPTIONS = {
  namespace: [],
  initial: {},
  actions: {},
  reducers: {},
  selectors: {}
};

var withNamespace = function withNamespace(ns) {
  return R.assoc('namespace', ns);
};

var makeSelectors = function makeSelectors(_ref) {
  var ns = _ref.namespace;
  return {
    getState: R.path(ns),
    getStateProp: function getStateProp(key) {
      return R.path(R.append(key, ns));
    }
  };
};

var defineReducers = function defineReducers(config) {
  return R.over(reducerLens, R.curry(reduxActions.handleActions)(R.__, config.initial), config);
};

var defineState = function defineState(namespace, builders) {
  return R.pipe(R.concat([withNamespace(namespace), select(makeSelectors)]), R.reduce(function (config, builder) {
    return builder(config);
  }, DEFAULT_OPTIONS), R.tap(function (config) {
    return log('defineState:', config);
  }), defineReducers)(builders);
};

var withForm = function withForm(fields) {
  return {
    error: null,
    fields: fields,
    fieldErrors: {},
    pending: false
  };
};

var withValidator = function withValidator(validator) {
  return R.assoc('validator', validator || validator_js.defineValidator({ spec: {} }));
};

var makeHandlers = function makeHandlers(_ref) {
  var _ref4;

  var actions = _ref.actions,
      initialState = _ref.initial,
      validator = _ref.validator;
  return _ref4 = {}, _defineProperty(_ref4, actions.formInput, function (state, _ref2) {
    var payload = _ref2.payload;

    var path$$1 = payload.field.split('.');
    var fields = R.assocPath(path$$1, payload.value, state.fields);
    var errors = validator.checkField(path$$1, fields);
    var fieldErrors = R.assocPath(path$$1, errors, state.fieldErrors);
    return R.merge(state, { fields: fields, fieldErrors: fieldErrors });
  }), _defineProperty(_ref4, actions.formReset, R.always(initialState)), _defineProperty(_ref4, actions.formSubmitPending, ramdaExtra_js.override({ error: null, pending: true })), _defineProperty(_ref4, actions.formSubmitComplete, {
    next: R.always(initialState),
    throw: function _throw(state, _ref3) {
      var error = _ref3.payload;
      return R.merge(state, { error: error, pending: false });
    }
  }), _ref4;
};

var makeSelectors$1 = function makeSelectors(_ref5) {
  var selectors = _ref5.selectors,
      validator = _ref5.validator;
  var getStateProp = selectors.getStateProp;


  return {
    getError: getStateProp('error'),
    getFields: getStateProp('fields'),
    getFieldErrors: getStateProp('fieldErrors'),
    isPending: getStateProp('pending'),
    isValid: R.pipe(getStateProp('fields'), validator.allValid)
  };
};

var defineFormState = function defineFormState(namespace) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extraBuilders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return defineState(namespace, R.concat([initial(withForm(options.fields)), actionGroup('FORM', ['INPUT', 'RESET']), actionGroup('FORM_SUBMIT', ['REQUESTED', 'PENDING', 'COMPLETE']), withValidator(options.validator), handle(makeHandlers), select(makeSelectors$1)], extraBuilders));
};

var initialItem = {
  error: null,
  item: null,
  pending: false
};

var makeHandlers$1 = function makeHandlers(_ref) {
  var _ref4;

  var actions = _ref.actions;
  return _ref4 = {}, _defineProperty(_ref4, actions.itemFetchPending, R.merge(R.__, {
    error: null,
    item: null,
    pending: true
  })), _defineProperty(_ref4, actions.itemFetchComplete, {
    next: function next(state, _ref2) {
      var item = _ref2.payload;
      return R.merge(state, {
        error: null,
        item: item,
        pending: false
      });
    },

    throw: function _throw(state, _ref3) {
      var error = _ref3.payload;
      return R.merge(state, { error: error, item: null, pending: false });
    }
  }), _ref4;
};

var makeSelectors$2 = function makeSelectors(_ref5) {
  var selectors = _ref5.selectors;
  var getStateProp = selectors.getStateProp;


  return {
    getError: getStateProp('error'),
    getItem: getStateProp('item'),
    isPending: getStateProp('pending')
  };
};

var defineItemState = function defineItemState(namespace) {
  var extraBuilders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return defineState(namespace, R.concat([initial(initialItem), actionGroup('ITEM_FETCH', ['REQUESTED', 'PENDING', 'COMPLETE']), handle(makeHandlers$1), select(makeSelectors$2)], extraBuilders));
};

var initialList = {
  error: null,
  ids: [],
  itemsMap: {},
  pending: false
};

var handleListAssoc = function handleListAssoc(state, _ref) {
  var item = _ref.payload;

  var hasCache = state.itemsMap[item.id] === item;
  return hasCache ? state : R.assocPath(['itemsMap', item.id], item, state);
};

var handleListDissoc = function handleListDissoc(state, _ref2) {
  var id = _ref2.payload;
  return R.evolve({
    ids: R.without([id]),
    itemsMap: R.dissoc(id)
  }, state);
};

var handleListPrepend = function handleListPrepend(state, _ref3) {
  var newItem = _ref3.payload;
  return R.evolve({
    ids: R.prepend(newItem.id),
    itemsMap: R.assoc(newItem.id, newItem)
  }, state);
};

var handleListAppend = function handleListAppend(state, _ref4) {
  var newItem = _ref4.payload;
  return R.evolve({
    ids: R.append(newItem.id),
    itemsMap: R.assoc(newItem.id, newItem)
  }, state);
};

var makeHandlers$2 = function makeHandlers(_ref5) {
  var _ref8;

  var actions = _ref5.actions;
  return _ref8 = {}, _defineProperty(_ref8, actions.listPending, ramdaExtra_js.override({ error: null, pending: true })), _defineProperty(_ref8, actions.listComplete, {
    next: function next(state, _ref6) {
      var items = _ref6.payload;

      var _normalizeBy = ramdaExtra_js.normalizeBy('id', items),
          ids = _normalizeBy.keys,
          itemsMap = _normalizeBy.itemsByKey;

      return R.merge(state, { error: null, pending: false, ids: ids, itemsMap: itemsMap });
    },

    throw: function _throw(state, _ref7) {
      var error = _ref7.payload;
      return R.merge(state, { error: error, pending: false });
    }
  }), _ref8;
};

var makeSelectors$3 = function makeSelectors(_ref9) {
  var selectors = _ref9.selectors;
  var getStateProp = selectors.getStateProp;


  var basic = {
    getError: getStateProp('error'),
    getIds: getStateProp('ids'),
    getItemsMap: getStateProp('itemsMap'),
    isPending: getStateProp('pending')
  };

  var getItemById = function getItemById(id, state) {
    return R.pipe(basic.getItemsMap, R.prop(id))(state);
  };

  var computed = {
    getItems: reselect.createSelector([basic.getIds, basic.getItemsMap], R.props),
    getItemById: R.curry(getItemById)
  };

  return R.merge(basic, computed);
};

var defineListState = function defineListState(namespace) {
  var extraBuilders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return defineState(namespace, R.concat([initial(initialList), actionGroup('LIST', ['REQUESTED', 'PENDING', 'COMPLETE']), handle(makeHandlers$2), select(makeSelectors$3)], extraBuilders));
};

exports.action = action;
exports.actionGroup = actionGroup;
exports.handle = handle;
exports.initial = initial;
exports.reducerLens = reducerLens;
exports.select = select;
exports.defineState = defineState;
exports.defineFormState = defineFormState;
exports.defineItemState = defineItemState;
exports.defineListState = defineListState;
exports.handleListAssoc = handleListAssoc;
exports.handleListDissoc = handleListDissoc;
exports.handleListAppend = handleListAppend;
exports.handleListPrepend = handleListPrepend;
//# sourceMappingURL=index.js.map
