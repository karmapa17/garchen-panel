import React from 'react';
import TextField from 'material-ui/TextField';
import cloneDeep from 'lodash.cloneDeep';

export default function renderTextField({input, label, meta: {touched, error}, ...custom}) {
  return <TextField floatingLabelText={label} errorText={touched && error} {...input} {...custom} />;
}
