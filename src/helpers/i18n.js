import Cache from './Cache';
import {get} from 'lodash';

export default class i18n {

  static getLocale() {
    return get(Cache.get('garchen-redux-state'), 'main.appLocale', 'en');
  }

  static getLocaleData(locale) {
    if ('bo' === locale) {
      return require(`./../langs/en.js`);
    }
    return require(`./../langs/${locale}.js`);
  }
}
