import {isEmpty} from 'lodash';
import {range} from 'ramda';

export default function getNextExplainationIndex({langValues, explainationLangs, explainationIndex}) {
  const lastIndexWithValue = range(0, explainationIndex)
    .reverse()
    .find((index) => explainationLangs.some((lang) => ! isEmpty(langValues[lang][index])));

  if (undefined === lastIndexWithValue) {
    return 1;
  }
  return lastIndexWithValue + 2;
}
