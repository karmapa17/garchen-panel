import test from 'ava';

import filterLastContinuousUndefinedValues from './../../src/helpers/filterLastContinuousUndefinedValues';

test('filterLastContinuousUndefinedValues should drop last continuous null, undefined, or empty string values', (t) => {
  const result = filterLastContinuousUndefinedValues(['test', null, null, 'test', null, undefined, '']);
  t.deepEqual(result, ['test', null, null, 'test']);
});
