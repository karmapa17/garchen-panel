import {sortBy, flatten} from 'lodash';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const langKeys = ['target-entry', 'explaination', 'explaination-source', 'explaination-note', 'explaination-category', 'original'];
const restKeys = ['category', 'sect'];
const order = flatten(langKeys.map((key) => {
  return DICTIONARY_LANGS.map(({value}) => `${key}-${value}`);
}))
.concat(restKeys);

export default function sortEntryKeys(keys) {
  return sortBy(keys, (key) => order.indexOf(key));
}
