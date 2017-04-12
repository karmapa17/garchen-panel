import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';

import renderTextField from './../../helpers/renderTextField';
import renderSelectField from './../../helpers/renderSelectField';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import {setNewFolderName} from './../../redux/modules/main';

const validate = (values) => {
  const errors = {};
  return errors;
};

@reduxForm({
  form: 'addFolderForm',
  validate
})
@connect(({main}) => ({
  newFolderName: main.get('newFolderName')
}), {setNewFolderName})
export default class AddFolderForm extends Component {

  static propTypes = {
    setNewFolderName: PropTypes.func.isRequired,
    newFolderName: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  renderLangMenuItems(key) {
    return DICTIONARY_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  handleNewFolderNameChange = (event) => this.props.setNewFolderName(event.target.value);

  render() {

    const {handleSubmit, newFolderName} = this.props;

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <Field name="name" component={renderTextField} onChange={this.handleNewFolderNameChange} label="folder name" autoFocus value={newFolderName} />
        </div>

        <div>
          <Field name="sourceLanguage" component={renderSelectField} label="Source Language" value="bo">
            {this.renderLangMenuItems('source-lang')}
          </Field>
        </div>

        <div>
          <Field name="targetLanguage" component={renderSelectField} label="Target Language" multiple>
            {this.renderLangMenuItems('target-lang')}
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
