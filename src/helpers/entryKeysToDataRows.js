import SECT_VALUES from './../constants/sectValues';
import CATEGORY_VALUES from './../constants/categoryValues';

const reArr = ['target-entry', 'explaination', 'original', 'source'].map((prop) => {
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
      if (lang) {
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
