export default function hasValue(value) {
  return (undefined !== value) && (null !== value) && ('' !== value);
}
