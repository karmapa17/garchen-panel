import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import TextField from 'material-ui/TextField';

const styles = require('./AddFolderForm.scss');

const validate = (values) => {
  const errors = {};
  if (! values.name) {
    errors.name = 'folder name is required';
  }
  return errors;
};

@reduxForm({
  form: 'addFolderForm',
  validate
})
export default class AddFolderForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  };

  renderTextField = ({input, label, meta: {touched, error}, ...custom}) => {
    return <TextField floatingLabelText={label} errorText={touched && error} {...input} {...custom} />;
  };

  render() {

    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <Field name="name" component={this.renderTextField} label="folder name" autoFocus />
        </div>
      </form>
    );
  }
}
