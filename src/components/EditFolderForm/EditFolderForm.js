import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

import objToArr from './../../helpers/objToArr';
import renderTextField from './../../helpers/renderTextField';
import renderSelectField from './../../helpers/renderSelectField';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import {setTargetLanguages} from './../../redux/modules/main';
import validate from './editFolderFormValidate';
import injectF from './../../helpers/injectF';
import MULTI_LANG_FIELDS from './../../constants/multiLangFields';

@connect(({main, folder}) => {
  const row = folder.get('folder');
  const {sourceLanguage, targetLanguages, contentFields} = row.fields;
  return {
    initialValues: {
      folderName: row.name,
      sourceLanguage,
      targetLanguages,
      contentFields
    },
    targetLanguages: main.get('targetLanguages')
  };
}, {setTargetLanguages})
@reduxForm({
  form: 'editFolderForm',
  validate
})
@injectF
export default class EditFolderForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setTargetLanguages: PropTypes.func,
    initialValues: PropTypes.object.isRequired,
    targetLanguages: PropTypes.array,
    f: PropTypes.func.isRequired,
    values: PropTypes.object
  };

  componentWillMount() {
    const {targetLanguages} = this.props.initialValues;
    this.props.setTargetLanguages(targetLanguages);
  }

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

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.props.setTargetLanguages(objToArr(data));
  };

  render() {

    const {handleSubmit, f} = this.props;

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
          <Field name="targetLanguages" component={renderSelectField} onChange={this.handleTargetLanguagesChange} label={f('target-language')} multiple>
            {this.renderLangMenuItems('target-lang')}
          </Field>
        </div>

        <div>
          <Field name="contentFields" component={renderSelectField} label={f('content-fields')} multiple fullWidth>
            {this.renderContentFields()}
          </Field>
        </div>

        <div>
          <RaisedButton primary type="submit" label={f('update')} />
        </div>
      </form>
    );
  }
}
