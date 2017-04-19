import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

import validate from './deleteFolderFormValidate';
import injectF from './../../helpers/injectF';
import injectMuiReduxFormHelper from './../../helpers/injectMuiReduxFormHelper';

@reduxForm({
  form: 'deleteFolderForm',
  validate
})
@injectF
@injectMuiReduxFormHelper
export default class DeleteFolderForm extends Component {

  static propTypes = {
    className: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
    initialValues: PropTypes.object.isRequired,
    renderTextField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    values: PropTypes.object
  };

  render() {

    const {handleSubmit, f, renderTextField, className, invalid, initialValues} = this.props;
    const {targetFolderName} = initialValues;
    const formProps = {};

    if (className) {
      formProps.className = className;
    }

    return (
      <form {...formProps} onSubmit={handleSubmit}>
        <p><WarningIcon style={{verticalAlign: 'middle', marginRight: '7px'}} />{f('delete-folder-instruction', {folderName: targetFolderName})}</p>
        <div>
          <input name="targetFolderName" type="hidden" />
          <Field name="folderName" component={renderTextField} label={f('folder-name')} /><RaisedButton disabled={invalid} primary type="submit" label={f('delete')} style={{verticalAlign: 'top', marginTop: '28px'}} />
        </div>
      </form>
    );
  }
}
