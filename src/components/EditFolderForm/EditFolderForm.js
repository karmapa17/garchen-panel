import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';

import objToArr from './../../helpers/objToArr';
import createRenderTextField from './../../helpers/createRenderTextField';
import createRenderSelectField from './../../helpers/createRenderSelectField';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import {setTargetLanguages} from './../../redux/modules/main';
import asyncValidate from './editFolderFormAsyncValidate';
import validate from './editFolderFormValidate';
import injectF from './../../helpers/injectF';
import MULTI_LANG_FIELDS from './../../constants/multiLangFields';

@connect(({main, folder}) => {
  const row = folder.get('folder');
  const {sourceLanguage, targetLanguages, contentFields} = row.fields;
  return {
    initialValues: {
      id: row.id,
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
  asyncValidate,
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

  constructor(props) {
    super(props);
    this.renderTextField = createRenderTextField(props.f);
    this.renderSelectField = createRenderSelectField(props.f);
  }

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
          <Field name="folderName" component={this.renderTextField} label={f('folder-name')} autoFocus />
        </div>

        <div>
          <Field name="sourceLanguage" component={this.renderSelectField} label={f('source-language')}>
            {this.renderLangMenuItems('source-lang')}
          </Field>
        </div>

        <div>
          <Field name="targetLanguages" component={this.renderSelectField} onChange={this.handleTargetLanguagesChange} label={f('target-language')} multiple>
            {this.renderLangMenuItems('target-lang')}
          </Field>
        </div>

        <div>
          <Field name="contentFields" component={this.renderSelectField} label={f('content-fields')} multiple fullWidth>
            {this.renderContentFields()}
          </Field>
        </div>

        <div className="button-wrap">
          <RaisedButton primary type="submit" label={f('update')} />
        </div>
      </form>
    );
  }
}
