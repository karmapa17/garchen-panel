require('babel-polyfill');
require('font-awesome-sass-loader');

import React from 'react';
import ReactDOM from 'react-dom';
import reducer from './redux/modules/reducer';
import thunk from 'redux-thunk';
import {Router, hashHistory} from 'react-router';
import {IntlProvider} from 'react-intl-redux';
import {Provider} from 'react-redux';
import {addLocaleData} from 'react-intl';
import {clientMiddleware} from './redux/middlewares';
import {createStore, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';

import bo from 'react-intl/locale-data/bo';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';


import i18n from './helpers/i18n';
import ipc from './helpers/ipc';
import getRoutes from './routes';

addLocaleData([...en, ...bo, ...zh]);

const createStoreWithMiddleware = applyMiddleware(thunk, clientMiddleware(ipc))(createStore);
const locale = i18n.getLocale();
const localeData = i18n.getLocaleData(locale);
const store = createStoreWithMiddleware(reducer, {intl: {locale, messages: localeData}});
const history = syncHistoryWithStore(hashHistory, store);

const routes = getRoutes();

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
