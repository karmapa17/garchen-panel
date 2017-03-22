export default class i18n {

  static getLang() {
    return localStorage.getItem('garchen:lang') || 'zh-TW';
  }

  static setLang(lang) {
    localStorage.setItem('garchen:lang', lang);
  }

  static getLangData(lang) {
    return require(`./../langs/${lang}.js`);
  }
}
