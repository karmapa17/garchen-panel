import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';

import main from './main';
import folder from './folder';

export default combineReducers({
  folder,
  intl: intlReducer,
  main,
  routing: routerReducer
});
