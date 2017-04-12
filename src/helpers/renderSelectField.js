import React from 'react';
import SelectField from 'material-ui/SelectField';

export default function renderSelectField(args) {

  const {input, label, meta: {touched, error}, children, ...custom} = args;
  const onChange = (event, index, value) => input.onChange(value);

  return (
    <SelectField floatingLabelText={label} errorText={touched && error}
    {...input} onChange={onChange} children={children} {...custom} />
  );
}
