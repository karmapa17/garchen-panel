import test from 'ava';

import Cache from './../../src/helpers/Cache';

test('Cache should save my value', (t) => {
  const value = {test: 1};
  Cache.set('test', value);
  const result = Cache.get('test');
  t.deepEqual(result, value);
});

test('Cache should catch error', (t) => {
  const value = undefined;
  Cache.set('test2', value);
  const result = Cache.get('test2');
  t.is(result, null);
});
