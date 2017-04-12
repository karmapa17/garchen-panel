export default class i18n {

  static getLocale() {
    return localStorage.getItem('garchen:locale') || 'en';
  }

  static setLocale(locale) {
    localStorage.setItem('garchen:locale', locale);
  }

  static getLocaleData(locale) {
    if ('bo' === locale) {
      return require(`./../langs/en.js`);
    }
    return require(`./../langs/${locale}.js`);
  }
}
