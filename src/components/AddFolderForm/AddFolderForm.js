import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import renderTextField from './../../helpers/renderTextField';
import renderSelectField from './../../helpers/renderSelectField';
import LANGS from './../../constants/langs';

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

  renderLangMenuItems() {
    return LANGS.map(({value, text}) => {
      return <MenuItem value={value} primaryText={text} />;
    });
  }

  render() {

    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <Field name="name" component={renderTextField} label="folder name" autoFocus />
        </div>

        <div>
          <Field name="sourceLanguage" component={renderSelectField} label="Source Language" value="bo">
            {this.renderLangMenuItems()}
          </Field>
        </div>

        <div>
          <Field name="targetLanguage" component={renderSelectField} label="Target Language" multiple>
            {this.renderLangMenuItems()}
          </Field>
        </div>

        <div>
          <Field name="contentFields" component={renderSelectField} label="Content Fields" multiple fullWidth>
            <MenuItem value="secondaryEntry" primaryText="secondaryEntry" />
            <MenuItem value="category" primaryText="category" />
            <MenuItem value="sect" primaryText="sect" />
            <MenuItem value="explaination" primaryText="explaination" />
            <MenuItem value="original" primaryText="original" />
            <MenuItem value="source" primaryText="source" />
          </Field>
        </div>
      </form>
    );
  }
}
