import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import injectF from './../../utils/injectF';
import injectMuiReduxFormHelper from './../../utils/injectMuiReduxFormHelper';
import DICTIONARY_LANGS from './../../main/constants/dictionaryLangs';
import validate from './addFolderFormValidate';
import asyncValidate from './addFolderFormAsyncValidate';
import MULTI_LANG_FIELDS from './../../constants/multiLangFields';
import REGULAR_FIELDS from './../../constants/regularFields';
import {SELECTED_MENU_STYLE} from './../../constants/constants';
import CropImg from './../CropImg/CropImg';

const styles = require('./AddFolderForm.scss');

@reduxForm({
  form: 'addFolderForm',
  asyncValidate,
  validate
})
@injectF
@injectMuiReduxFormHelper
export default class AddFolderForm extends Component {

  static propTypes = {
    renderTextField: PropTypes.func.isRequired,
    onTargetLanguagesChange: PropTypes.func.isRequired,
    renderSelectField: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    targetLanguages: PropTypes.array.isRequired,
    f: PropTypes.func.isRequired,
    onCancelButtonTouchTap: PropTypes.func.isRequired,
    values: PropTypes.object
  };

  renderLangMenuItems(key) {
    return DICTIONARY_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  renderContentFields = () => {

    const {f, targetLanguages} = this.props;

    const fields = [];

    MULTI_LANG_FIELDS.forEach((textId) => {
      (targetLanguages || []).forEach((lang) => {
        fields.push({textId, params: {lang: f(lang)}, value: `${textId}-${lang}`});
      });
    });

    return fields.concat(REGULAR_FIELDS)
      .map(({value, textId, params}) => {
        return <MenuItem key={`content-field-${value}`} value={value} primaryText={f(textId, params)} />;
      });
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

    const {handleSubmit, f, onCancelButtonTouchTap, renderTextField,
      renderSelectField, onTargetLanguagesChange} = this.props;

    return (
      <form className={styles.addFolderForm} onSubmit={handleSubmit}>

        <div className={styles.formBody}>
          <div>
            <Field name="folderName" component={renderTextField} label={f('folder-name')} onBlur={this.handleBlur} autoFocus />
          </div>

          <div>
            <Field name="sourceLanguage" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE} label={f('source-language')}>
              {this.renderLangMenuItems('source-lang')}
            </Field>
          </div>

          <div>
            <Field name="targetLanguages" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE}
              onChange={onTargetLanguagesChange} label={f('target-language')} multiple>
              {this.renderLangMenuItems('target-lang')}
            </Field>
          </div>

          <div>
            <Field name="contentFields" component={renderSelectField} selectedMenuItemStyle={SELECTED_MENU_STYLE}
              label={f('content-fields')} multiple fullWidth>
              {this.renderContentFields()}
            </Field>
          </div>

          <div>
            <Field name="source" component={renderTextField} label={f('source')} />
          </div>

          <div>
            <Field name="coverPic" type="file" component={CropImg}/>
          </div>

        </div>

        <div className={styles.formFooter}>
          <FlatButton type="button" label={f('cancel')} onTouchTap={onCancelButtonTouchTap} />
          <FlatButton type="submit" label={f('submit')} primary />
        </div>
      </form>
    );
  }
}
