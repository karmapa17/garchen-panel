import {isEmpty} from 'lodash';

export default function getExplainationLangs(contentFields) {
  return contentFields.map((field) => (field.match(/^explaination-lang-(.+)$/) || [])[1])
    .filter((lang) => (! isEmpty(lang)));
}
