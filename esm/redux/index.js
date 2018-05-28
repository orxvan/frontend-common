import _Object$freeze from 'babel-runtime/core-js/object/freeze';
import camelCase from 'lodash/camelCase';
import { __, always, append, assoc, assocPath, concat, curry, dissoc, evolve, head, ifElse, isEmpty, join, lensProp, map, merge, over, path, pipe, prepend, prop, props, reduce, tap, without } from 'ramda';
import { createAction, handleActions } from 'redux-actions';
import { argList, isNilOrEmpty, normalizeBy, override } from '../ramda-extra.js';
import debug from 'debug';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import { defineValidator } from '../validator.js';
import { createSelector } from 'reselect';

var withPrefix = pipe(argList, ifElse(pipe(head, isNilOrEmpty), always(''), join('')), concat);

var reducerLens = lensProp('reducers');
var selectorLens = lensProp('selectors');

var initial = function initial(state) {
  return assoc('initial', _Object$freeze(state));
};

var action = function action(ns, name) {
  return assocPath(['actions', camelCase(name)], createAction(withPrefix(join('/', ns), '/')(name)));
};

var actionGroup = function actionGroup(prefix, names) {
  return function (config) {
    return reduce(function (acc, name) {
      return action(config.namespace, name)(acc);
    }, config, isEmpty(prefix) ? names : map(withPrefix(prefix, '_'), names));
  };
};

var handle = function handle(makeHandlers) {
  return function (config) {
    return over(reducerLens, override(makeHandlers(config)), config);
  };
};

var select = function select(makeSelectors) {
  return function (config) {
    return over(selectorLens, override(makeSelectors(config)), config);
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
  return assoc('namespace', ns);
};

var makeSelectors = function makeSelectors(_ref) {
  var ns = _ref.namespace;
  return {
    getState: path(ns),
    getStateProp: function getStateProp(key) {
      return path(append(key, ns));
    }
  };
};

var defineReducers = function defineReducers(config) {
  return over(reducerLens, curry(handleActions)(__, config.initial), config);
};

var defineState = function defineState(namespace, builders) {
  return pipe(concat([withNamespace(namespace), select(makeSelectors)]), reduce(function (config, builder) {
    return builder(config);
  }, DEFAULT_OPTIONS), tap(function (config) {
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
  return assoc('validator', validator || defineValidator({ spec: {} }));
};

var makeHandlers = function makeHandlers(_ref) {
  var _ref4;

  var actions = _ref.actions,
      initialState = _ref.initial,
      validator = _ref.validator;
  return _ref4 = {}, _defineProperty(_ref4, actions.formInput, function (state, _ref2) {
    var payload = _ref2.payload;

    var path$$1 = payload.field.split('.');
    var fields = assocPath(path$$1, payload.value, state.fields);
    var errors = validator.checkField(path$$1, fields);
    var fieldErrors = assocPath(path$$1, errors, state.fieldErrors);
    return merge(state, { fields: fields, fieldErrors: fieldErrors });
  }), _defineProperty(_ref4, actions.formReset, always(initialState)), _defineProperty(_ref4, actions.formSubmitPending, override({ error: null, pending: true })), _defineProperty(_ref4, actions.formSubmitComplete, {
    next: always(initialState),
    throw: function _throw(state, _ref3) {
      var error = _ref3.payload;
      return merge(state, { error: error, pending: false });
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
    isValid: pipe(getStateProp('fields'), validator.allValid)
  };
};

var defineFormState = function defineFormState(namespace) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var extraBuilders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return defineState(namespace, concat([initial(withForm(options.fields)), actionGroup('FORM', ['INPUT', 'RESET']), actionGroup('FORM_SUBMIT', ['REQUESTED', 'PENDING', 'COMPLETE']), withValidator(options.validator), handle(makeHandlers), select(makeSelectors$1)], extraBuilders));
};

var initialItem = {
  error: null,
  item: null,
  pending: false
};

var makeHandlers$1 = function makeHandlers(_ref) {
  var _ref4;

  var actions = _ref.actions;
  return _ref4 = {}, _defineProperty(_ref4, actions.itemFetchPending, merge(__, {
    error: null,
    item: null,
    pending: true
  })), _defineProperty(_ref4, actions.itemFetchComplete, {
    next: function next(state, _ref2) {
      var item = _ref2.payload;
      return merge(state, {
        error: null,
        item: item,
        pending: false
      });
    },

    throw: function _throw(state, _ref3) {
      var error = _ref3.payload;
      return merge(state, { error: error, item: null, pending: false });
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
  return defineState(namespace, concat([initial(initialItem), actionGroup('ITEM_FETCH', ['REQUESTED', 'PENDING', 'COMPLETE']), handle(makeHandlers$1), select(makeSelectors$2)], extraBuilders));
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
  return hasCache ? state : assocPath(['itemsMap', item.id], item, state);
};

var handleListDissoc = function handleListDissoc(state, _ref2) {
  var id = _ref2.payload;
  return evolve({
    ids: without([id]),
    itemsMap: dissoc(id)
  }, state);
};

var handleListPrepend = function handleListPrepend(state, _ref3) {
  var newItem = _ref3.payload;
  return evolve({
    ids: prepend(newItem.id),
    itemsMap: assoc(newItem.id, newItem)
  }, state);
};

var handleListAppend = function handleListAppend(state, _ref4) {
  var newItem = _ref4.payload;
  return evolve({
    ids: append(newItem.id),
    itemsMap: assoc(newItem.id, newItem)
  }, state);
};

var makeHandlers$2 = function makeHandlers(_ref5) {
  var _ref8;

  var actions = _ref5.actions;
  return _ref8 = {}, _defineProperty(_ref8, actions.listPending, override({ error: null, pending: true })), _defineProperty(_ref8, actions.listComplete, {
    next: function next(state, _ref6) {
      var items = _ref6.payload;

      var _normalizeBy = normalizeBy('id', items),
          ids = _normalizeBy.keys,
          itemsMap = _normalizeBy.itemsByKey;

      return merge(state, { error: null, pending: false, ids: ids, itemsMap: itemsMap });
    },

    throw: function _throw(state, _ref7) {
      var error = _ref7.payload;
      return merge(state, { error: error, pending: false });
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
    return pipe(basic.getItemsMap, prop(id))(state);
  };

  var computed = {
    getItems: createSelector([basic.getIds, basic.getItemsMap], props),
    getItemById: curry(getItemById)
  };

  return merge(basic, computed);
};

var defineListState = function defineListState(namespace) {
  var extraBuilders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return defineState(namespace, concat([initial(initialList), actionGroup('LIST', ['REQUESTED', 'PENDING', 'COMPLETE']), handle(makeHandlers$2), select(makeSelectors$3)], extraBuilders));
};

export { action, actionGroup, handle, initial, reducerLens, select, defineState, defineFormState, defineItemState, defineListState, handleListAssoc, handleListDissoc, handleListAppend, handleListPrepend };
//# sourceMappingURL=index.js.map
