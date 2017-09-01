import test from 'ava';

import hasValue from './../../src/utils/hasValue';

test('hasValue should return false when null is present', (t) => {
  const result = hasValue(null);
  t.is(result, false);
});

test('hasValue should return false when undefined is present', (t) => {
  const result = hasValue(undefined);
  t.is(result, false);
});

test('hasValue should return false when empty string is present', (t) => {
  const result = hasValue('');
  t.is(result, false);
});

test('hasValue should work as expected', (t) => {
  t.is(hasValue('true'), true);
  t.is(hasValue(0), true);
  t.is(hasValue(1.2), true);
  t.is(hasValue({}), true);
  t.is(hasValue([]), true);
  t.is(hasValue(() => {}), true);
});
