import {flatten, sortBy} from 'lodash';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const keys = ['target-entry-lang', 'explaination-lang', 'original-lang', 'source-lang', 'category', 'sect'];
const order = flatten(keys.map((key) => {
  if (key.match(/-lang$/)) {
    return DICTIONARY_LANGS.map(({value}) => `${key}-${value}`);
  }
  return key;
}));

export default function sortContentFields(fields) {
  return sortBy(fields, (field) => order.indexOf(field));
}
