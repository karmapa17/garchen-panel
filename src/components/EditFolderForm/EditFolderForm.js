import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import asyncValidate from './editFolderFormAsyncValidate';
import validate from './editFolderFormValidate';
import injectF from './../../helpers/injectF';
import injectMuiReduxFormHelper from './../../helpers/injectMuiReduxFormHelper';
import MULTI_LANG_FIELDS from './../../constants/multiLangFields';

@reduxForm({
  form: 'editFolderForm',
  asyncValidate,
  validate
})
@injectF
@injectMuiReduxFormHelper
export default class EditFolderForm extends Component {

  static propTypes = {
    renderTextField: PropTypes.func.isRequired,
    renderSelectField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    targetLanguages: PropTypes.array.isRequired,
    onTargetLanguagesChange: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired,
    values: PropTypes.object
  };

  renderLangMenuItems(key) {
    return DICTIONARY_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  renderContentFields = () => {

    const {f, targetLanguages} = this.props;

    const DEFAULT_CONTENT_FILEDS = [
      {textId: 'category', value: 'category'},
      {textId: 'sect', value: 'sect'}
    ];

    const fields = [];

    MULTI_LANG_FIELDS.forEach((textId) => {
      (targetLanguages || []).forEach((lang) => {
        fields.push({textId, params: {lang: f(lang)}, value: `${textId}-${lang}`});
      });
    });

    return fields.concat(DEFAULT_CONTENT_FILEDS)
      .map(({value, textId, params}) => {
        return <MenuItem key={`content-field-${value}`} value={value} primaryText={f(textId, params)} />;
      });
  };

  render() {

    const {handleSubmit, f, renderTextField, renderSelectField, onTargetLanguagesChange} = this.props;

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <Field name="folderName" component={renderTextField} label={f('folder-name')} autoFocus />
        </div>

        <div>
          <Field name="sourceLanguage" component={renderSelectField} label={f('source-language')}>
            {this.renderLangMenuItems('source-lang')}
          </Field>
        </div>

        <div>
          <Field name="targetLanguages" component={renderSelectField} onChange={onTargetLanguagesChange} label={f('target-language')} multiple>
            {this.renderLangMenuItems('target-lang')}
          </Field>
        </div>

        <div>
          <Field name="contentFields" component={renderSelectField} label={f('content-fields')} multiple fullWidth>
            {this.renderContentFields()}
          </Field>
        </div>

        <div>
          <Field name="source" component={renderTextField} label={f('source')} />
        </div>

        <div className="button-wrap">
          <RaisedButton primary type="submit" label={f('update')} />
        </div>
      </form>
    );
  }
}
