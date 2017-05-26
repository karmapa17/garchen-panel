import {isEmpty} from 'lodash';

export default function getExplanationLangs(contentFields) {
  return contentFields.map((field) => (field.match(/^explanation-lang-(.+)$/) || [])[1])
    .filter((lang) => (! isEmpty(lang)));
}
