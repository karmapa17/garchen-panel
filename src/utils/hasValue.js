import {isArray} from 'lodash';

export default function hasValue(value) {
  if (isArray(value)) {
    return (value.length > 0);
  }
  return (undefined !== value) && (null !== value) && ('' !== value);
}
