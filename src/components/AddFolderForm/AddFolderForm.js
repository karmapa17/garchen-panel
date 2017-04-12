import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';

import objToArr from './../../helpers/objToArr';
import renderTextField from './../../helpers/renderTextField';
import renderSelectField from './../../helpers/renderSelectField';
import DICTIONARY_LANGS from './../../constants/dictionaryLangs';
import {setTargetLanguages} from './../../redux/modules/main';
import validate from './addFolderFormValidate';

@reduxForm({
  form: 'addFolderForm',
  validate
})
@connect(({main}) => ({
  targetLanguages: main.get('targetLanguages')
}), {setTargetLanguages})
@injectIntl
export default class AddFolderForm extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setTargetLanguages: PropTypes.func,
    targetLanguages: PropTypes.array,
    intl: PropTypes.object.isRequired,
    values: PropTypes.object
  };

  renderLangMenuItems(key) {
    return DICTIONARY_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  renderContentFields = () => {

    const {intl: {formatMessage}, targetLanguages} = this.props;

    const DEFAULT_CONTENT_FILEDS = [
      {textId: 'category', value: 'category'},
      {textId: 'sect', value: 'sect'}
    ];

    const fields = [];

    ['target-entry-lang', 'explaination-lang', 'original-lang', 'source-lang'].forEach((textId) => {
      (targetLanguages || []).forEach((lang) => {
        fields.push({textId, params: {lang: formatMessage({id: lang})}, value: `${textId}-${lang}`});
      });
    });

    return fields.concat(DEFAULT_CONTENT_FILEDS)
      .map(({value, textId, params}) => {
        return <MenuItem key={`content-field-${value}`} value={value} primaryText={formatMessage({id: textId}, params)} />;
      });
  };

  handleTargetLanguagesChange = (rawData) => {
    const data = cloneDeep(rawData);
    delete data.preventDefault;
    this.props.setTargetLanguages(objToArr(data));
  };

  render() {

    const {handleSubmit, intl: {formatMessage}} = this.props;

    return (
      <form onSubmit={handleSubmit}>

        <div>
          <Field name="folderName" component={renderTextField} label={formatMessage({id: 'folder-name'})} autoFocus />
        </div>

        <div>
          <Field name="sourceLanguage" component={renderSelectField} label={formatMessage({id: 'source-language'})}>
            {this.renderLangMenuItems('source-lang')}
          </Field>
        </div>

        <div>
          <Field name="targetLanguages" component={renderSelectField} onChange={this.handleTargetLanguagesChange} label={formatMessage({id: 'target-language'})} multiple>
            {this.renderLangMenuItems('target-lang')}
          </Field>
        </div>

        <div>
          <Field name="contentFields" component={renderSelectField} label={formatMessage({id: 'content-fields'})} multiple fullWidth>
            {this.renderContentFields()}
          </Field>
        </div>
      </form>
    );
  }
}
