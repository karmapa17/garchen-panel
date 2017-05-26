import {uniq, isEmpty} from 'lodash';
import sortFolderContentFields from './sortFolderContentFields';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const FIELD_PAGE_NUM = 'page-num';
const FIELD_EXPLAINATION_NOTE = 'explanation-note';
const FIELD_EXPLAINATION_SOURCE = 'explanation-source';
const FIELD_EXPLAINATION_CATEGORY = 'explanation-category';

const RE_SOURCE_ENTRY = /^source-entry-(.+)$/;
const RE_EXPLAINATION = /^explanation-(.+)$/;
const RE_EXPLAINATION_NOTE = /^explanation-note$/;
const RE_EXPLAINATION_CATEGORY = /^explanation-category$/;

const getSourceLang = (key) => {
  const [, lang] = key.match(RE_SOURCE_ENTRY) || [];
  return validLangs.includes(lang) ? lang : null;
};

const getExplanationLang = (key) => {
  const [, lang] = key.match(RE_EXPLAINATION) || [];
  return validLangs.includes(lang) ? lang : null;
};

const isArrayField = (key) => {
  return [RE_EXPLAINATION, RE_EXPLAINATION_NOTE, RE_EXPLAINATION_CATEGORY].some((re) => re.exec(key));
};

const validLangs = DICTIONARY_LANGS.map((row) => row.value);

export default class CsvProcessor {

  static isColumnRow(data) {
    return data.some((key) => {
      const sourceLanguage = getSourceLang(key);
      return !! sourceLanguage;
    });
  }

  static getColumnData(data) {

    const result = data.reduce((columnData, key, index) => {

      const sourceLanguage = getSourceLang(key);

      if (sourceLanguage) {
        columnData.sourceLanguage = sourceLanguage;
      }

      const explanationLanguage = getExplanationLang(key);

      if (explanationLanguage) {
        columnData.targetLanguages.push(explanationLanguage);
        columnData.contentFields.push(`explanation-lang-${explanationLanguage}`);
      }

      if (FIELD_PAGE_NUM === key) {
        columnData.contentFields.push(FIELD_PAGE_NUM);
      }

      return columnData;

    }, {sourceLanguage: '', targetLanguages: [], contentFields: []});

    result.targetLanguages = uniq(result.targetLanguages);
    result.contentFields = sortFolderContentFields(result.contentFields);

    return result;
  }

  static getFields(data) {

    return data.reduce((fields, key, index) => {

      const sourceLanguage = getSourceLang(key);
      const explanationLanguage = getExplanationLang(key);

      if (sourceLanguage) {
        fields[index] = 'sourceEntry';
      }
      else if (explanationLanguage) {
        fields[index] = `explanation-${explanationLanguage}`;
      }
      else if (FIELD_EXPLAINATION_NOTE === key) {
        fields[index] = FIELD_EXPLAINATION_NOTE;
      }
      else if (FIELD_EXPLAINATION_SOURCE === key) {
        fields[index] = FIELD_EXPLAINATION_SOURCE;
      }
      else if (FIELD_EXPLAINATION_CATEGORY === key) {
        fields[index] = FIELD_EXPLAINATION_CATEGORY;
      }
      else if (FIELD_PAGE_NUM === key) {
        fields[index] = FIELD_PAGE_NUM;
      }
      else {
        // unknown columns
        fields[index] = undefined;
      }
      return fields;
    }, []);
  }

  static getRowDataByFields(data, fields) {
    return fields.reduce((rowData, field, index) => {
      if (field) {

        if (FIELD_EXPLAINATION_CATEGORY === field) {
          const value = data[index];
          rowData[field] = value ? [value.split(',').map(Number)] : [[]];
        }
        else if (isArrayField(field)) {
          rowData[field] = [data[index]]
        }
        else {
          rowData[field] = data[index];
        }
      }
      return rowData;
    }, {});
  }

  static appendData(newData, oldData, fields) {

    return fields.reduce((oldData, field, index) => {

      if (isArrayField(field)) {
        const arr = oldData[field];
        const value = newData[index];

        if (value && (FIELD_EXPLAINATION_CATEGORY === field)) {
          arr.push(value.split(',').map(Number));
        }
        else if (value) {
          arr.push(value);
        }
      }
      return oldData;
    }, oldData);
  }

  // for csv export
  static getCsvRowsByEntry({folder, entry}) {

    const {sourceLanguage, contentFields} = folder.data;
    const defaultData = {
      [`source-entry-${sourceLanguage}`]: entry.sourceEntry
    };

    let hasHandledExplanationNote = false;
    let hasHandledExplanationSource = false;
    let hasHandledExplanationCategory = false;

    return contentFields.reduce((rows, field) => {

      if (FIELD_PAGE_NUM === field) {
        rows[0][FIELD_PAGE_NUM] = entry.data[FIELD_PAGE_NUM];
      }

      const [, explanationLang] = field.match(/^explanation-lang-(.+)$/) || [];

      if (explanationLang) {
        (entry.data[`explanation-${explanationLang}`] || []).forEach((explanation, index) => {
          if (isEmpty(rows[index])) {
            rows[index] = {};
          }
          rows[index][`explanation-${explanationLang}`] = explanation;
        });

        if (! hasHandledExplanationNote) {
          const notes = entry.data[FIELD_EXPLAINATION_NOTE] || [];
          notes.forEach((note, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLAINATION_NOTE] = note;
          });
          hasHandledExplanationNote = true;
        }

        if (! hasHandledExplanationSource) {
          const sources = entry.data[FIELD_EXPLAINATION_SOURCE] || [];
          sources.forEach((source, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLAINATION_SOURCE] = source;
          });
          hasHandledExplanationSource = true;
        }

        if (! hasHandledExplanationCategory) {
          const categories = entry.data[FIELD_EXPLAINATION_CATEGORY] || [];
          categories.forEach((category, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLAINATION_CATEGORY] = category;
          });
          hasHandledExplanationCategory = true;
        }
      }

      return rows;
    }, [defaultData])
  }
}
