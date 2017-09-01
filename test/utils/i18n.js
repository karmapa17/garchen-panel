import test from 'ava';

import i18n from './../../src/utils/i18n';

test('i18n.getLocale should work as expected', (t) => {
  const result = i18n.getLocale();
  t.is(result, 'en');
});

test('i18n.getLocaleData should work as expected for bo language code', (t) => {
  const result = i18n.getLocaleData('bo');
  t.is((Object.keys(result).length > 0), true);
});

test('i18n.getLocaleData should work as expected for other language code', (t) => {
  const result = i18n.getLocaleData('en');
  t.is((Object.keys(result).length > 0), true);
});
