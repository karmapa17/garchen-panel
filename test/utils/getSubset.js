import test from 'ava';

import getSubset from './../../src/utils/getSubset';

test('getSubset should filter my paths', (t) => {

  const subset = getSubset({
    test1: true,
    test2: {
      test3: true,
      test4: 0,
      test5: false
    },
    test6: 'string',
    test7: null
  }, ['test2.test3', 'test2.test4', 'test2.test5', 'test6', 'test7']);

  const expected = {
    test2: {
      test3: true,
      test4: 0,
      test5: false
    },
    test6: 'string'
  };

  t.deepEqual(subset, expected);
});

test('getSubset should work even if no paths were provided', (t) => {

  const subset = getSubset({
    test1: true,
    test2: {
      test3: true
    },
    test4: 'string'
  });

  t.deepEqual(subset, subset);
});
