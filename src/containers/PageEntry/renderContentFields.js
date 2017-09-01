import React from 'react';
import {sortBy, get} from 'lodash';
import {range} from 'ramda';
import hasValue from './../../helpers/hasValue';
import toMap from './../../helpers/toMap';
import getTargetEntryFields from './getTargetEntryFields';
import getExplanationFields from './getExplanationFields';
import getOriginalFields from './getOriginalFields';
import SECT_VALUES from './../../constants/sectValues';
import CATEGORY_VALUES from './../../constants/categoryValues';
import EXPLANATION_CATEGORY_VALUES from './../../constants/explanationCategoryValues';

const fieldsInOrder = ['target-entry', 'explanation', 'original', 'category', 'sect'];

const hasData = (prop, data) => (prop in data) && hasValue(data[prop]);

function toFieldData({f, data, contentFields, targetLanguages}) {

  const fieldMap = toMap(contentFields);
  const fieldData = {};
  const targetEntryFields = getTargetEntryFields({fieldMap, targetLanguages});

  if (targetEntryFields.length > 0) {

    fieldData['target-entry'] = targetEntryFields.filter(({prop}) => hasData(prop, data))
      .map(({prop, lang}) => {
        return (
          <tr key={`tr-${prop}`}>
            <th>{f('target-entry-lang', {lang: f(lang)})}</th>
            <td>{data[prop]}</td>
          </tr>
        );
      });
  }

  const explanationFields = getExplanationFields({fieldMap, targetLanguages});

  if (explanationFields.length > 0) {

    const highestIndex = explanationFields.reduce((index, {prop}) => {
      const arr = data[prop] || [];
      const length = arr.length;
      return (length > index) ? length : index;
    }, 0);

    const sourceData = data['explanation-source'];
    const noteData = data['explanation-note'];
    const categoryData = data['explanation-category'];

    fieldData.explanation = range(0, highestIndex)
      .map((index) => {

        const rows = explanationFields.map(({prop, lang}) => {
          const arr = data[prop] || [];
          return {lang, value: arr[index]};
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
            const categoryId = EXPLANATION_CATEGORY_VALUES.find((row) => row.value === value).id;
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

  const originalFields = getOriginalFields({fieldMap, targetLanguages});

  if (originalFields.length > 0) {

    fieldData.original = originalFields.filter(({prop}) => hasData(prop, data))
      .map(({prop, lang}) => {
        return (
          <tr key={`tr-${prop}`}>
            <th>{f('original-lang', {lang: f(lang)})}</th>
            <td>{data[prop]}</td>
          </tr>
        );
      });
  }

  if (fieldMap.category && hasData('category', data)) {
    const value = data.category;
    const categoryId = CATEGORY_VALUES.find((row) => row.value === value).id;

    fieldData.category = (
      <tr key="tr-category">
        <th>{f('category')}</th>
        <td>{f(categoryId)}</td>
      </tr>
    );
  }

  if (fieldMap.sect && hasData('sect', data)) {

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

export default function renderContentFields({f, data, contentFields, targetLanguages}) {
  const fieldData = toFieldData({f, data, contentFields, targetLanguages});
  return sortBy(Object.keys(fieldData), (field) => fieldsInOrder.indexOf(field))
    .map((field) => fieldData[field]);
}
