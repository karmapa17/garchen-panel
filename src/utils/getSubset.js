function hasValue(value) {
  return (!! value) || (0 === value) || (false === value);
}

export default function getSubset(obj, paths) {

  if (! paths) {
    return obj;
  }

  const subset = {};

  paths.forEach((path) => {

    const keys = path.split('.');
    const length = keys.length;
    const lastIndex = length - 1;

    let index = 0;
    let value = obj;
    let nested = subset;

    // Retrieve value specified by path
    while (value && index < length) {
      value = value[keys[index++]];
    }

    // Add to subset if the specified path is defined and hasValue
    if (index === length && hasValue(value)) {
      keys.forEach((key, i) => {
        if (i === lastIndex) {
          nested[key] = value;
        }
        else if (! nested[key]) {
          nested[key] = {};
        }
        nested = nested[key];
      });
    }
  });

  return subset;
}
