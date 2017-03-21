require('babel-polyfill');
require('bootstrap-loader');

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {IndexRoute, Redirect, Router, Route, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';

import {App, PageHome, PageAbout} from './containers';
import reducer from './modules/reducer';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = syncHistoryWithStore(hashHistory, store);

if (module.hot) {
  module.hot.accept('./modules/reducer', () => {
    store.replaceReducer(require('./modules/reducer').default);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={PageHome} />
        <Route path="about" component={PageAbout} />
      </Route>
      <Redirect from="*" to="/" />
    </Router>
  </Provider>
, document.getElementById('root'));
