import {get} from 'lodash';

import Cache from './Cache';
import LOCAL_STORAGE_KEY from './../constants/localStorageKey';

export default class i18n {

  static getLocale() {
    return get(Cache.get(LOCAL_STORAGE_KEY), 'main.appLocale', 'en');
  }

  static getLocaleData(locale) {
    return require(`./../langs/${locale}.js`);
  }
}
