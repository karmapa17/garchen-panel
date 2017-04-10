import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';

import auth from './auth';
import main from './main';
import folder from './folder';

export default combineReducers({
  auth,
  folder,
  intl: intlReducer,
  main,
  routing: routerReducer
});
