import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import FlatButton from 'material-ui/FlatButton';

import injectF from './../../helpers/injectF';
import injectMuiReduxFormHelper from './../../helpers/injectMuiReduxFormHelper';
import objToArr from './../../helpers/objToArr';
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
@injectMuiReduxFormHelper
export default class AddFolderForm extends Component {

  static propTypes = {
    renderTextField: PropTypes.func.isRequired,
    renderSelectField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setTargetLanguages: PropTypes.func,
    targetLanguages: PropTypes.array,
    f: PropTypes.func.isRequired,
    onCancelButtonTouchTap: PropTypes.func.isRequired,
    values: PropTypes.object
  };

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

  handleBlur = (event) => {
    // fix leaving a form takes two clicks
    // https://github.com/erikras/redux-form/issues/860
    const {relatedTarget} = event;
    if (relatedTarget && ('button' === relatedTarget.getAttribute('type'))) {
      event.preventDefault();
    }
  };

  render() {

    const {handleSubmit, f, onCancelButtonTouchTap, renderTextField, renderSelectField} = this.props;

    return (
      <form className={styles.addFolderForm} onSubmit={handleSubmit}>

        <div className={styles.formBody}>
          <div>
            <Field name="folderName" component={renderTextField} label={f('folder-name')} onFocus={this.handleFocus} onBlur={this.handleBlur} autoFocus />
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
        </div>

        <div className={styles.formFooter}>
          <FlatButton type="button" label="Cancel" onTouchTap={onCancelButtonTouchTap} />
          <FlatButton type="submit" label="Submit" primary />
        </div>
      </form>
    );
  }
}
