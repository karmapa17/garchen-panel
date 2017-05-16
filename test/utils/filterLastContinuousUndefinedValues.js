import test from 'ava';

import filterLastContinuousUndefinedValues from './../../src/helpers/filterLastContinuousUndefinedValues';

test('Cache should save my value', (t) => {
  const result = filterLastContinuousUndefinedValues(['test', null, null, 'test', null, undefined, '']);
  t.deepEqual(result, ['test', null, null, 'test']);
});
