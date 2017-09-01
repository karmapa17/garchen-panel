import hasValue from './hasValue';

export default function hasData(prop, data) {
  return (prop in data) && hasValue(data[prop]);
}
