import React from 'react';
import SelectField from 'material-ui/SelectField';

export default function createRenderSelectField(f) {

  return function renderSelectField(args) {

    const {input, label, meta: {touched, error}, children, ...custom} = args;
    const onChange = (event, index, value) => input.onChange(value);

    let errorText = touched && error;

    // handle i18n
    if (touched && error && 'string' !== typeof error) {
      errorText = f(error.id, error.params);
    }

    return (
      <SelectField floatingLabelText={label} errorText={errorText}
      {...input} onChange={onChange} children={children} {...custom} />
    );
  };
}
