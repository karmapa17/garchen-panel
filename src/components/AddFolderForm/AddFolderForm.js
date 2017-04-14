import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import FlatButton from 'material-ui/FlatButton';

import injectF from './../../helpers/injectF';
import objToArr from './../../helpers/objToArr';
import createRenderTextField from './../../helpers/createRenderTextField';
import createRenderSelectField from './../../helpers/createRenderSelectField';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import {setTargetLanguages} from './../../redux/modules/main';
import validate from './addFolderFormValidate';
import asyncValidate from './addFolderFormAsyncValidate';

const styles = require('./AddFolderForm.scss');

@reduxForm({
  form: 'addFolderForm',
  asyncValidate,
  validate
})
@connect(({main}) => ({
  targetLanguages: main.get('targetLanguages')
}), {setTargetLanguages})
@injectF
export default class AddFolderForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    setTargetLanguages: PropTypes.func,
    targetLanguages: PropTypes.array,
    f: PropTypes.func.isRequired,
    onCancelButtonClick: PropTypes.func.isRequired,
    values: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.renderTextField = createRenderTextField(props.f);
    this.renderSelectField = createRenderSelectField(props.f);
  }

  componentWillMount() {
    this.props.setTargetLanguages([]);
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

    ['target-entry-lang', 'explaination-lang', 'original-lang', 'source-lang'].forEach((textId) => {
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

    const {handleSubmit, f, onCancelButtonClick, invalid} = this.props;

    return (
      <form className={styles.addFolderForm} onSubmit={handleSubmit}>

        <div className={styles.formBody}>
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
        </div>

        <div className={styles.formFooter}>
          <FlatButton label="Cancel" onTouchTap={onCancelButtonClick} />
          <FlatButton type="submit" label="Submit" primary disabled={invalid} />
        </div>
      </form>
    );
  }
}
