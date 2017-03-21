import {values as toValues} from 'ramda';

export default function mapConnect(state, obj) {

  const props = Object.keys(obj);
  const values = toValues(obj);
  const reducerData = {};

  return values.reduce((data, value, index) => {

    const [reducerName, reducerProp] = value.split('.');

    if (! (reducerName in reducerData)) {
      reducerData[reducerName] = state[reducerName].toJS();
    }

    data[props[index]] = reducerData[reducerName][reducerProp];

    return data;
  }, {});
}
