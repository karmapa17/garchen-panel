import React from 'react';
import TextField from 'material-ui/TextField';

export default function createRenderTextField(f) {
  return function renderTextField({input, label, meta: {touched, error}, ...custom}) {

    let errorText = touched && error;

    // handle i18n
    if (touched && error && 'string' !== typeof error) {
      errorText = f(error.id, error.params);
    }
    return <TextField floatingLabelText={label} errorText={errorText} {...input} {...custom} />;
  };
}
