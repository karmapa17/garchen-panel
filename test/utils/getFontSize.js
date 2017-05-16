import test from 'ava';

import getFontSize from './../../src/helpers/getFontSize';

test('getFontSize should work as expected', (t) => {
  const fontSize = getFontSize(2, 2);
  t.is(fontSize, '4.00em');
});
