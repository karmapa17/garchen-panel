import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';
import {reducer as formReducer} from 'redux-form';

import auth from './auth';
import main from './main';
import folder from './folder';
import folderEntry from './folderEntry';

export default combineReducers({
  auth,
  folderEntry,
  form: formReducer,
  folder,
  intl: intlReducer,
  main,
  routing: routerReducer
});
