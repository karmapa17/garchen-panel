import Cache from './Cache';

export default class i18n {

  static getLocale() {
    return Cache.get('garchen:locale') || 'en';
  }

  static setLocale(locale) {
    Cache.set('garchen:locale', locale);
  }

  static getLocaleData(locale) {
    if ('bo' === locale) {
      return require(`./../langs/en.js`);
    }
    return require(`./../langs/${locale}.js`);
  }
}
