import {uniq} from 'lodash';

import sortFolderContentFields from './sortFolderContentFields';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';

const RE_SOURCE_ENTRY = /^source-entry-(.+)$/;
const RE_EXPLAINATION = /^explaination-(.+)$/;
const RE_EXPLAINATION_NOTE = /^explaination-note-(.+)$/;

const getSourceLang = (key) => {
  const lang = (key.match(RE_SOURCE_ENTRY) || [])[1];
  return validLangs.includes(lang) ? lang : null;
};

const getExplainationLang = (key) => {
  const lang = (key.match(RE_EXPLAINATION) || [])[1];
  return validLangs.includes(lang) ? lang : null;
};

const getExplainationNoteLang = (key) => {
  const lang = (key.match(RE_EXPLAINATION_NOTE) || [])[1];
  return validLangs.includes(lang) ? lang : null;
};

const isArrayField = (key) => {
  return [RE_EXPLAINATION, RE_EXPLAINATION_NOTE].some((re) => re.exec(key));
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

      const explainationNoteLanguage = getExplainationNoteLang(key);

      if (explainationNoteLanguage) {
        columnData.targetLanguages.push(explainationNoteLanguage);
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
      const explainationNoteLanguage = getExplainationNoteLang(key);

      if (sourceLanguage) {
        fields[index] = 'sourceEntry';
      }
      else if (explainationLanguage) {
        fields[index] = `explaination-${explainationLanguage}`;
      }
      else if (explainationNoteLanguage) {
        fields[index] = `explaination-note-${explainationNoteLanguage}`;
      }
      else if ('page-num' === key) {
        fields[index] = 'page-num';
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
        rowData[field] = isArrayField(field) ? [data[index]] : data[index];
      }
      return rowData;
    }, {});
  }

  static appendData(newData, oldData, fields) {

    return fields.reduce((oldData, field, index) => {

      if (isArrayField(field)) {
        const arr = oldData[field];
        const value = newData[index];
        if (value) {
          arr.push(value);
        }
      }
      return oldData;
    }, oldData);
  }
}
