require('babel-polyfill');
require('font-awesome-sass-loader!./../assets/styles/font-awesome-sass.config.js');

import React from 'react';
import ReactDOM from 'react-dom';
import rootReducer from './redux/modules/reducer';
import thunk from 'redux-thunk';
import {Router, hashHistory} from 'react-router';
import {IntlProvider} from 'react-intl-redux';
import {Provider} from 'react-redux';
import {addLocaleData} from 'react-intl';
import clientMiddleware from './redux/middlewares/clientMiddleware';
import {compose, createStore, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import persistState, {mergePersistedState} from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';

import bo from 'react-intl/locale-data/bo';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import i18n from './helpers/i18n';
import ipc from './helpers/ipc';
import getRoutes from './routes';
import serialize from './helpers/serialize';
import deserialize from './helpers/deserialize';

addLocaleData([...en, ...bo, ...zh]);

const middlewares = [thunk, clientMiddleware(ipc)];
const locale = i18n.getLocale();
const localeData = i18n.getLocaleData(locale);
const reducer = compose(mergePersistedState(deserialize))(rootReducer);
const storage = compose(serialize)(adapter(window.localStorage));
const enhancer = compose(
  applyMiddleware(...middlewares),
  persistState(storage, 'garchen-redux-state')
);
const store = createStore(reducer, {intl: {locale, messages: localeData}}, enhancer);
const history = syncHistoryWithStore(hashHistory, store);

const routes = getRoutes(store);

if (module.hot) {
  module.hot.accept('./redux/modules/reducer', () => {
    store.replaceReducer(require('./redux/modules/reducer').default);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={history}>{routes}</Router>
    </IntlProvider>
  </Provider>
, document.getElementById('root'));
