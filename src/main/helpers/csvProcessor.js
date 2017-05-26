import {uniq, isEmpty} from 'lodash';
import sortFolderContentFields from './sortFolderContentFields';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';

const FIELD_PAGE_NUM = 'page-num';

const RE_SOURCE_ENTRY = /^source-entry-(.+)$/;
const RE_EXPLAINATION = /^explaination-(.+)$/;
const RE_EXPLAINATION_NOTE = /^explaination-note$/;
const RE_EXPLAINATION_CATEGORY = /^explaination-category$/;

const getSourceLang = (key) => {
  const [, lang] = key.match(RE_SOURCE_ENTRY) || [];
  return validLangs.includes(lang) ? lang : null;
};

const getExplainationLang = (key) => {
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

      const explainationLanguage = getExplainationLang(key);

      if (explainationLanguage) {
        columnData.targetLanguages.push(explainationLanguage);
        columnData.contentFields.push(`explaination-lang-${explainationLanguage}`);
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
      const explainationLanguage = getExplainationLang(key);

      if (sourceLanguage) {
        fields[index] = 'sourceEntry';
      }
      else if (explainationLanguage) {
        fields[index] = `explaination-${explainationLanguage}`;
      }
      else if ('explaination-note' === key) {
        fields[index] = 'explaination-note';
      }
      else if ('explaination-source' === key) {
        fields[index] = 'explaination-source';
      }
      else if ('explaination-category' === key) {
        fields[index] = 'explaination-category';
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

        if ('explaination-category' === field) {
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

        if (value && ('explaination-category' === field)) {
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

    let hasHandledExplainationNote = false;
    let hasHandledExplainationSource = false;
    let hasHandledExplainationCategory = false;

    return contentFields.reduce((rows, field) => {

      if (FIELD_PAGE_NUM === field) {
        rows[0][FIELD_PAGE_NUM] = entry.data[FIELD_PAGE_NUM];
      }

      const [, explainationLang] = field.match(/^explaination-lang-(.+)$/) || [];

      if (explainationLang) {
        (entry.data[`explaination-${explainationLang}`] || []).forEach((explaination, index) => {
          if (isEmpty(rows[index])) {
            rows[index] = {};
          }
          rows[index][`explaination-${explainationLang}`] = explaination;
        });

        if (! hasHandledExplainationNote) {
          const notes = entry.data['explaination-note'] || [];
          notes.forEach((note, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index]['explaination-note'] = note;
          });
          hasHandledExplainationNote = true;
        }

        if (! hasHandledExplainationSource) {
          const sources = entry.data['explaination-source'] || [];
          sources.forEach((source, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index]['explaination-source'] = source;
          });
          hasHandledExplainationSource = true;
        }

        if (! hasHandledExplainationCategory) {
          const categories = entry.data['explaination-category'] || [];
          categories.forEach((category, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index]['explaination-category'] = category;
          });
          hasHandledExplainationCategory = true;
        }
      }

      return rows;
    }, [defaultData])
  }
}
