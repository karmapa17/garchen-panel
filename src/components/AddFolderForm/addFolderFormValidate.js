import {isEmpty} from 'lodash';

export default function addFolderFormValidate(values) {

  const errors = {};

  if (! values.sourceLanguage) {
    errors.sourceLanguage = 'Field source language is required.';
  }

  if (isEmpty(values.targetLanguages)) {
    errors.targetLanguages = 'Please choose at least one target language.';
  }

  if (isEmpty(values.contentFields)) {
    errors.contentFields = 'Please choose at least one content field.';
  }

  return errors;
}
