import SECT_VALUES from './../constants/sectValues';
import CATEGORY_VALUES from './../constants/categoryValues';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const validLangs = DICTIONARY_LANGS.map((row) => row.value);

const reArr = ['target-entry', 'explaination', 'explaination-source', 'explaination-note', 'original'].map((prop) => {
  return {
    prop,
    re: new RegExp(`^${prop}-(.+)$`)
  };
});

export default function entryKeysToDataRows(keys, data, f) {

  return keys.map((key) => {

    const value = data[key];

    for (let i = 0; i < reArr.length; i++) {
      const {prop, re} = reArr[i];
      const lang = (re.exec(key) || [])[1];
      if (validLangs.includes(lang)) {
        return {key: prop, value, lang};
      }
    }

    if ('category' === key) {
      const categoryId = CATEGORY_VALUES.find((row) => row.value === value).id;
      return {key, value: f(categoryId)};
    }

    if ('sect' === key) {
      const sectId = SECT_VALUES.find((row) => row.value === value).id;
      return {key, value: f(sectId)};
    }
    return {key, value};
  });
}
