require('babel-polyfill');
require('bootstrap-loader');
require('font-awesome-sass-loader');

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {IndexRoute, Redirect, Router, Route, hashHistory} from 'react-router';
import {IntlProvider} from 'react-intl-redux';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {addLocaleData} from 'react-intl';

import en from 'react-intl/locale-data/en';
import bo from 'react-intl/locale-data/bo';
import zh from 'react-intl/locale-data/zh';

import {App, PageHome, PageAbout, PageFolderList} from './containers';
import reducer from './redux/modules/reducer';
import {i18n} from './helpers';

addLocaleData([...en, ...bo, ...zh]);

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const locale = i18n.getLang();
const localeData = i18n.getLangData(locale);
const store = createStoreWithMiddleware(reducer, {intl: {locale, messages: localeData}});
const history = syncHistoryWithStore(hashHistory, store);

if (module.hot) {
  module.hot.accept('./redux/modules/reducer', () => {
    store.replaceReducer(require('./redux/modules/reducer').default);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={PageFolderList} />
          <Route path="folders" component={PageFolderList} />
          <Route path="about" component={PageAbout} />
        </Route>
        <Redirect from="*" to="/" />
      </Router>
    </IntlProvider>
  </Provider>
, document.getElementById('root'));
