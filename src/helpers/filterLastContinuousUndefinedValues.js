import hasValue from './hasValue';

export default function filterLastContinuousUndefinedValues(arr) {
  const newArr = [];
  let startCollecting = false;

  for (let i = arr.length - 1; i >= 0; i--) {
    const value = arr[i];
    if (hasValue(value)) {
      startCollecting = true;
    }
    if (startCollecting) {
      newArr.unshift(value);
    }
  }
  return newArr;
}
