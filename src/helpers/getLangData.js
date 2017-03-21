export default function getLangData(lang) {
  return require(`./../langs/${lang}.js`);
}
