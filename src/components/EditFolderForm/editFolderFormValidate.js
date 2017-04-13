import {isEmpty} from 'lodash';

export default function editFolderFormValidate(values) {

  const errors = {};

  if (! values.sourceLanguage) {
    errors.sourceLanguage = {id: 'field-source-language-required'};
  }

  if (isEmpty(values.targetLanguages)) {
    errors.targetLanguages = {id: 'choose-at-least-one-target-language'};
  }

  if (isEmpty(values.contentFields)) {
    errors.contentFields = {id: 'choose-at-least-one-content-field'};
  }

  return errors;
}
