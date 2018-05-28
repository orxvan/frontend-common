import _default20 from 'ramda/src/props';
import _default19 from 'ramda/src/append';
import _default18 from 'ramda/src/path';
import _default17 from 'ramda/src/__';
import _default16 from 'ramda/src/curry';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _default15 from 'ramda/src/merge';
import _default14 from 'ramda/src/over';
import _default13 from 'ramda/src/map';
import _default12 from 'ramda/src/isEmpty';
import _default11 from 'ramda/src/reduce';
import _default10 from 'ramda/src/assocPath';
import _default9 from 'ramda/src/evolve';
import _Object$freeze from 'babel-runtime/core-js/object/freeze';
import _default8 from 'ramda/src/assoc';
import _default7 from 'ramda/src/lensProp';
import _default6 from 'ramda/src/join';
import _default5 from 'ramda/src/always';
import _default4 from 'ramda/src/head';
import _default3 from 'ramda/src/ifElse';
import _default2 from 'ramda/src/concat';
import _default from 'ramda/src/pipe';
import camelCase from 'lodash/camelCase';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { argList, isNilOrEmpty, normalizeBy, override } from './ramda-extra.js';
import { define } from './validator.js';

var withPrefix = _default(argList, _default3(_default(_default4, isNilOrEmpty), _default5(''), _default6('')), _default2);

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
  return _default9({ namespace: override(ns) });
};

var defineAction = function defineAction(_ref, name) {
  var domain = _ref.domain;
  return _default10(['actions', camelCase(name)], createAction(withPrefix(domain, '/')(name)));
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
    return _default14(reducerLens, override(makeHandlers(config)), config);
  };
};

var handleListActions = function handleListActions(_ref2) {
  var _ref5;

  var actions = _ref2.actions;
  return _ref5 = {}, _defineProperty(_ref5, actions.listPending, override({ error: null, pending: true })), _defineProperty(_ref5, actions.listComplete, {
    next: function next(state, _ref3) {
      var items = _ref3.payload;

      var _normalizeBy = normalizeBy('id', items),
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
  }), _defineProperty(_ref9, actions.formReset, _default5(initialState)), _defineProperty(_ref9, actions.formSubmitPending, override({ error: null, pending: true })), _defineProperty(_ref9, actions.formSubmitComplete, {
    next: _default5(initialState),
    throw: function _throw(state, _ref8) {
      var error = _ref8.payload;
      return _default15(state, { error: error, pending: false });
    }
  }), _ref9;
};

var select = function select(makeSelectors) {
  return function (config) {
    return _default14(selectorLens, override(makeSelectors(config)), config);
  };
};

var defineReducers = function defineReducers(config) {
  return _default14(reducerLens, _default16(handleActions)(_default17, config.initial), config);
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
  }), actionGroup('FORM', ['INPUT', 'RESET']), actionGroup('FORM_SUBMIT', ['REQUESTED', 'PENDING', 'COMPLETE']), _default8('validator', options.validator || define({ spec: {} })), handle(handleFormActions), select(function (_ref11) {
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
      getItems: createSelector([basic.getIds, basic.getItemsMap], _default20)
    };

    return _default15(basic, computed);
  })], extraBuilders));
};

export { actionGroup, define$1 as define, handle, initial, makeForm, makeList, select };
//# sourceMappingURL=state.js.map
