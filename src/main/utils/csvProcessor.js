import {uniq, isEmpty} from 'lodash';
import sortFolderContentFields from './sortFolderContentFields';
import DICTIONARY_LANGS from './../constants/dictionaryLangs';
import FRATION_LENGTH from './../constants/fractionLength';
import floatToPageNum from './../utils/floatToPageNum';

export const FIELD_PAGE_NUM = 'page-num';
export const FIELD_CATEGORY = 'category';
export const FIELD_SECT = 'sect';
export const FIELD_EXPLANATION_NOTE = 'explanation-note';
export const FIELD_EXPLANATION_SOURCE = 'explanation-source';
export const FIELD_EXPLANATION_CATEGORY = 'explanation-category';

export const RE_SOURCE_ENTRY = /^source-entry-(.+)$/;
export const RE_TARGET_ENTRY = /^target-entry-(.+)$/;
export const RE_ORIGINAL = /^original-(.+)$/;
export const RE_EXPLANATION = /^explanation-(.+)$/;
export const RE_EXPLANATION_NOTE = /^explanation-note$/;
export const RE_EXPLANATION_CATEGORY = /^explanation-category$/;

const getSourceLang = (key) => {
  const [, lang] = key.match(RE_SOURCE_ENTRY) || [];
  return validLangs.includes(lang) ? lang : null;
};

const getTargetEntryLang = (key) => {
  const [, lang] = key.match(RE_TARGET_ENTRY) || [];
  return validLangs.includes(lang) ? lang : null;
};

const getOriginalLang = (key) => {
  const [, lang] = key.match(RE_ORIGINAL) || [];
  return validLangs.includes(lang) ? lang : null;
};

const getExplanationLang = (key) => {
  const [, lang] = key.match(RE_EXPLANATION) || [];
  return validLangs.includes(lang) ? lang : null;
};

const isArrayField = (key) => {
  return [RE_EXPLANATION, RE_EXPLANATION_NOTE, RE_EXPLANATION_CATEGORY].some((re) => re.exec(key));
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

    const result = data.reduce((columnData, key) => {

      const sourceLanguage = getSourceLang(key);

      if (sourceLanguage) {
        columnData.sourceLanguage = sourceLanguage;
      }

      const explanationLanguage = getExplanationLang(key);

      if (explanationLanguage) {
        columnData.targetLanguages.push(explanationLanguage);
        columnData.contentFields.push(`explanation-lang-${explanationLanguage}`);
      }

      const targetEntryLanguage = getTargetEntryLang(key);

      if (targetEntryLanguage) {
        columnData.targetLanguages.push(targetEntryLanguage);
        columnData.contentFields.push(`target-entry-lang-${targetEntryLanguage}`);
      }

      const originalLanguage = getOriginalLang(key);

      if (originalLanguage) {
        columnData.targetLanguages.push(originalLanguage);
        columnData.contentFields.push(`original-lang-${originalLanguage}`);
      }

      if (FIELD_CATEGORY === key) {
        columnData.contentFields.push(FIELD_CATEGORY);
      }

      if (FIELD_SECT === key) {
        columnData.contentFields.push(FIELD_SECT);
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
      const targetEntryLanguage = getTargetEntryLang(key);
      const originalLanguage = getOriginalLang(key);

      if (sourceLanguage) {
        fields[index] = 'sourceEntry';
      }
      else if (targetEntryLanguage) {
        fields[index] = `target-entry-${targetEntryLanguage}`;
      }
      else if (originalLanguage) {
        fields[index] = `original-${originalLanguage}`;
      }
      else if (explanationLanguage) {
        fields[index] = `explanation-${explanationLanguage}`;
      }
      else if (FIELD_EXPLANATION_NOTE === key) {
        fields[index] = FIELD_EXPLANATION_NOTE;
      }
      else if (FIELD_EXPLANATION_SOURCE === key) {
        fields[index] = FIELD_EXPLANATION_SOURCE;
      }
      else if (FIELD_EXPLANATION_CATEGORY === key) {
        fields[index] = FIELD_EXPLANATION_CATEGORY;
      }
      else if (FIELD_PAGE_NUM === key) {
        fields[index] = FIELD_PAGE_NUM;
      }
      else if (FIELD_CATEGORY === key) {
        fields[index] = FIELD_CATEGORY;
      }
      else if (FIELD_SECT === key) {
        fields[index] = FIELD_SECT;
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

        if (FIELD_EXPLANATION_CATEGORY === field) {
          const value = data[index];
          rowData[field] = value ? [value.split(',').map(Number)] : [[]];
        }
        else if ([FIELD_CATEGORY, FIELD_SECT].includes(field)) {
          const value = parseInt(data[index], 10);
          if (value) {
            rowData[field] = value;
          }
        }
        else if (isArrayField(field)) {
          rowData[field] = [data[index]];
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

        if (FIELD_EXPLANATION_CATEGORY === field) {
          arr.push(value ? value.split(',').map(Number) : null);
          return oldData;
        }

        arr.push(value ? value : null);
      }
      return oldData;
    }, oldData);
  }

  // for csv export
  static getCsvHeaders(folder) {
    const {sourceLanguage, contentFields} = folder.data;

    let hasExplanation = false;

    let csvHeaders = contentFields.reduce((fields, field) => {
      const csvField = field.replace('-lang-', '-');

      if (RE_EXPLANATION.test(csvField)) {
        hasExplanation = true;
      }

      return [...fields, csvField];
    }, [`source-entry-${sourceLanguage}`]);

    if (hasExplanation) {
      csvHeaders = [...csvHeaders, FIELD_EXPLANATION_NOTE, FIELD_EXPLANATION_CATEGORY, FIELD_EXPLANATION_SOURCE];
    }

    return csvHeaders;
  }

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
        rows[0][FIELD_PAGE_NUM] = floatToPageNum(entry.pageNum, FRATION_LENGTH);
      }

      if (FIELD_CATEGORY === field) {
        rows[0][FIELD_CATEGORY] = entry.data.category;
      }

      if (FIELD_SECT === field) {
        rows[0][FIELD_SECT] = entry.data.sect;
      }

      const [, targetEntryLang] = field.match(/^target-entry-lang-(.+)$/) || [];

      if (targetEntryLang) {
        rows[0][`target-entry-${targetEntryLang}`] = entry.data[`target-entry-${targetEntryLang}`];
      }

      const [, originalLang] = field.match(/^original-lang-(.+)$/) || [];

      if (originalLang) {
        rows[0][`original-${originalLang}`] = entry.data[`original-${originalLang}`];
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
          const notes = entry.data[FIELD_EXPLANATION_NOTE] || [];
          notes.forEach((note, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLANATION_NOTE] = note;
          });
          hasHandledExplanationNote = true;
        }

        if (! hasHandledExplanationSource) {
          const sources = entry.data[FIELD_EXPLANATION_SOURCE] || [];
          sources.forEach((source, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLANATION_SOURCE] = source;
          });
          hasHandledExplanationSource = true;
        }

        if (! hasHandledExplanationCategory) {
          const categories = entry.data[FIELD_EXPLANATION_CATEGORY] || [];
          categories.forEach((category, index) => {
            if (isEmpty(rows[index])) {
              rows[index] = {};
            }
            rows[index][FIELD_EXPLANATION_CATEGORY] = category;
          });
          hasHandledExplanationCategory = true;
        }
      }

      return rows;
    }, [defaultData]);
  }
}
