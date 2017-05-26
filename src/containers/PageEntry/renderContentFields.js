import React from 'react';
import {sortBy, get} from 'lodash';
import {range} from 'ramda';

import SECT_VALUES from './../../constants/sectValues';
import CATEGORY_VALUES from './../../constants/categoryValues';
import EXPLAINATION_CATEGORY_VALUES from './../../constants/explanationCategoryValues';
import hasValue from './../../helpers/hasValue';

const fieldsInOrder = ['page-num', 'target-entry', 'explanation', 'category', 'sect'];

const hasData = (prop, data) => (prop in data) && hasValue(data[prop]);

function hasTagetEntry({contentFields, targetLanguages}) {
  return contentFields.some((field) => {
    const lang = (field.match(/^target-entry-lang-(.+)$/) || [])[1];
    return targetLanguages.includes(lang);
  });
}

function hasExplaination({contentFields, targetLanguages}) {
  return contentFields.some((field) => {
    const lang = (field.match(/^explanation-lang-(.+)$/) || [])[1];
    return targetLanguages.includes(lang);
  });
}


function toFieldData({f, data, contentFields, targetLanguages}) {

  const fieldData = {};

  if (hasTagetEntry({contentFields, targetLanguages})) {

    const genTargetEntryKey = (lang) => `target-entry-${lang}`;

    fieldData['target-entry'] = targetLanguages.filter((lang) => hasData(genTargetEntryKey(lang), data))
      .map((lang) => {
        const key = genTargetEntryKey(lang);
        return (
          <tr key={`tr-${key}`}>
            <th>{f('target-entry-lang', {lang: f(lang)})}</th>
            <td>{data[key]}</td>
          </tr>
        );
      });
  }

  if (hasData('page-num', data)) {
    fieldData['page-num'] = (
      <tr key="tr-page-num">
        <th>{f('page-num')}</th>
        <td>{data['page-num']}</td>
      </tr>
    );
  }

  if (hasExplaination({contentFields, targetLanguages})) {

    const getExplainationKey = (lang) => `explanation-${lang}`;

    const highestIndex = targetLanguages.reduce((index, lang) => {
      const key = getExplainationKey(lang);
      const arr = data[key] || [];
      const length = arr.length;
      return (length > index) ? length : index;
    }, 0);

    const sourceData = data['explanation-source'];
    const noteData = data['explanation-note'];
    const categoryData = data['explanation-category'];

    fieldData.explanation = range(0, highestIndex)
      .map((index) => {

        const rows = targetLanguages.map((lang) => {
          const key = getExplainationKey(lang);
          const arr = data[key] || [];
          const value = arr[index];
          return {lang, value};
        })
        .filter(({value}) => hasValue(value))
        .map(({lang, value}) => {
          return (
            <tr key={`explanation-${lang}`}>
              <th>{f('explanation-num-lang', {num: `${index + 1}`, lang: f(lang)})}</th>
              <td>{value}</td>
            </tr>
          );
        });

        const source = get(sourceData, index);

        if (hasValue(source)) {
          rows.push((
            <tr key={'explanation-source'}>
              <th>{f('explanation-source-num', {num: `${index + 1}`})}</th>
              <td>{source}</td>
            </tr>
          ));
        }

        const note = get(noteData, index);

        if (hasValue(note)) {
          rows.push((
            <tr key={'explanation-note'}>
              <th>{f('explanation-note-num', {num: `${index + 1}`})}</th>
              <td>{note}</td>
            </tr>
          ));
        }

        const category = get(categoryData, index);

        if (hasValue(category)) {

          const value = category.map((value) => {
            const categoryId = EXPLAINATION_CATEGORY_VALUES.find((row) => row.value === value).id;
            return f(categoryId);
          })
          .join(' ');

          rows.push((
            <tr key={'explanation-category'}>
              <th>{f('explanation-category-num', {num: `${index + 1}`})}</th>
              <td>{value}</td>
            </tr>
          ));
        }

        return rows;
      });
  }

  if (hasData('category', data)) {
    const value = data.category;
    const categoryId = CATEGORY_VALUES.find((row) => row.value === value).id;

    fieldData.category = (
      <tr key="tr-category">
        <th>{f('category')}</th>
        <td>{f(categoryId)}</td>
      </tr>
    );
  }

  if (hasData('sect', data)) {

    const value = data.sect;
    const sectId = SECT_VALUES.find((row) => row.value === value).id;

    fieldData.sect = (
      <tr key="tr-sect">
        <th>{f('sect')}</th>
        <td>{f(sectId)}</td>
      </tr>
    );
  }

  return fieldData;
}

function render(fieldData) {
  const fields = sortBy(Object.keys(fieldData), (field) => fieldsInOrder.indexOf(field));
  return fields.map((field) => fieldData[field]);
}

export default function renderContentFields({f, data, contentFields, targetLanguages}) {
  const fieldData = toFieldData({f, data, contentFields, targetLanguages});
  return render(fieldData);
}
