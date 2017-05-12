import Cache from './Cache';
import {get} from 'lodash';

import LOCAL_STORAGE_KEY from './../constants/localStorageKey';

export default class i18n {

  static getLocale() {
    return get(Cache.get(LOCAL_STORAGE_KEY), 'main.appLocale', 'en');
  }

  static getLocaleData(locale) {
    if ('bo' === locale) {
      return require(`./../langs/en.js`);
    }
    return require(`./../langs/${locale}.js`);
  }
}
