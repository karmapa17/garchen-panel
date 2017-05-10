import {isEmpty} from 'lodash';

export default function filterLastContinuousUndefinedValues(arr) {
  const newArr = [];
  let hasValue = false;

  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    if (! isEmpty(value)) {
      hasValue = true;
    }
    if (hasValue) {
      newArr.unshift(value);
    }
  }
  return newArr;
}
