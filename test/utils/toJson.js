import test from 'ava';

import toJson from './../../src/helpers/toJson';

test('toJson should check if children have toJSON function and call it', (t) => {
  const result = toJson({
    test: 1,
    test2: {
      toJSON: () => 'test'
    }
  });
  t.deepEqual(result, {test: 1, test2: 'test'});
});
