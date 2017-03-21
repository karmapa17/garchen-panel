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
import reducer from './redux/modules/reducer';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = syncHistoryWithStore(hashHistory, store);

if (module.hot) {
  module.hot.accept('./redux/modules/reducer', () => {
    store.replaceReducer(require('./redux/modules/reducer').default);
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
