import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';
import {reducer as formReducer} from 'redux-form';

import auth from './auth';
import main from './main';
import folder from './folder';
import entry from './entry';
import ui from './ui';
import crossFolderSearch from './crossFolderSearch';

export default combineReducers({
  auth,
  ui,
  entry,
  form: formReducer,
  folder,
  crossFolderSearch,
  intl: intlReducer,
  main,
  routing: routerReducer
});
