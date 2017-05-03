import {uniq} from 'lodash';

import sortFolderContentFields from './../../helpers/sortFolderContentFields';
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
      }
      else if (explainationLanguage) {
      }
      else if (explainationNoteLanguage) {
      }
      return fields;
    }, []);
  }
}
