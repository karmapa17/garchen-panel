import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import APP_LANGS from './../../constants/appLangs';
import {setIntl} from './../../redux/modules/main';

const styles = require('./PageSettings.scss');

@connect(({main}) => ({
  appLocale: main.get('appLocale')
}), {setIntl})
@injectIntl
export default class PageSettings extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    appLocale: PropTypes.string.isRequired,
    setIntl: PropTypes.func.isRequired
  };

  renderLangMenuItems(key) {
    return APP_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  handleLangSelectFieldChange = (event, index, value) => {
    this.props.setIntl(value);
  };

  render() {
    const {appLocale, intl: {formatMessage}} = this.props;
    return (
      <div className={styles.pageSettings}>
        <h1>{formatMessage({id: 'settings'})}</h1>
        <div>
          <LanguageIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <SelectField floatingLabelText={formatMessage({id: 'app-language'})} onChange={this.handleLangSelectFieldChange} value={appLocale}>
            {this.renderLangMenuItems('site-lang')}
          </SelectField>
        </div>
      </div>
    );
  }
}
