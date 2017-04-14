import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import FlatButton from 'material-ui/FlatButton';

import injectMuiReduxFormHelper from './../../helpers/injectMuiReduxFormHelper';
import injectF from './../../helpers/injectF';
import validate from './addFolderEntryFormValidate';

const styles = require('./AddFolderEntryForm.scss');

@reduxForm({
  form: 'addFolderEntryForm',
  validate
})
@connect(({main}) => ({
}), {})
@injectF
@injectMuiReduxFormHelper
export default class AddFolderEntryForm extends Component {

  static propTypes = {
    folder: PropTypes.object.isRequired,
    renderTextField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    f: PropTypes.func.isRequired,
    onCancelButtonClick: PropTypes.func.isRequired
  };

  render() {

    const {handleSubmit, f, onCancelButtonClick, invalid, renderTextField, folder} = this.props;
    console.log('folder', folder);

    return (
      <form className={styles.addFolderEntryForm} onSubmit={handleSubmit}>

        <div className={styles.formBody}>
          <div>
            <Field name="entry" type="text" component={renderTextField} label={f('entry-lang', {lang: 'bo'})} autoFocus />
          </div>
        </div>

        <div className={styles.formFooter}>
          <FlatButton label={f('cancel')} onTouchTap={onCancelButtonClick} />
          <FlatButton type="submit" label={f('submit')} primary disabled={invalid} />
        </div>
      </form>
    );
  }
}
