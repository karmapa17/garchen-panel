import test from 'ava';

import filterFolderContentFields from './../../src/helpers/filterFolderContentFields';

test('filterFolderContentFields should filter with given langs', (t) => {
  const result = filterFolderContentFields(['en'], ['target-entry-en', 'target-entry-bo', 'explanation-lang-en', 'source']);
  t.deepEqual(result, ["target-entry-en","target-entry-bo","explanation-lang-en", "source"]);
});
