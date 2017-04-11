import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';

const styles = require('./AddFolderForm.scss');

console.log('here', reduxForm);

@reduxForm({
  form: 'addFolderForm'
})
export default class AddFolderForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired
  };

  render() {

    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Folder name</label>
          <Field name="name" component="input" type="text"/>
        </div>
      </form>
    );
  }
}
