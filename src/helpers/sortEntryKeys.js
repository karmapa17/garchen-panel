import {sortBy, flatten} from 'lodash';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const langKeys = ['targetEntry', 'explaination', 'original', 'source'];
const restKeys = ['category', 'sect'];
const order = flatten(langKeys.map((key) => {
  return DICTIONARY_LANGS.map(({value}) => `${key}-${value}`);
}))
.concat(restKeys);

console.log('order', order);

export default function sortEntryKeys(keys) {
  return sortBy(keys, (key) => order.indexOf(key));
}
