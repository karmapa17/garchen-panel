import {isEmpty} from 'lodash';
import {range} from 'ramda';

export default function getNextExplainationIndex({langValues, explanationLangs, explanationIndex}) {
  const lastIndexWithValue = range(0, explanationIndex)
    .reverse()
    .find((index) => explanationLangs.some((lang) => ! isEmpty(langValues[lang][index])));

  if (undefined === lastIndexWithValue) {
    return 1;
  }
  return lastIndexWithValue + 2;
}
