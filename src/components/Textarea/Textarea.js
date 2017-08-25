import React, {PureComponent} from 'react';
import {Field} from 'redux-form';
import TextareaAutosize from 'react-autosize-textarea';

export default class Textarea extends PureComponent {

  field = ({input, style}) => {
    return <TextareaAutosize {...input} style={style} />;
  };

  render() {
    return <Field {...this.props} component={this.field} />;
  }
}
