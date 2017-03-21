import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';

import main from './main';

export default combineReducers({
  main,
  routing: routerReducer,
  intl: intlReducer
});
