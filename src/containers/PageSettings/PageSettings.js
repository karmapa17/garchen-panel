import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import Slider from 'material-ui/Slider';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import c from 'classnames';

import APP_LANGS from './../../constants/appLangs';
import {setIntl, setWriteDelay} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';

const styles = require('./PageSettings.scss');

@connect(({main}) => ({
  appLocale: main.get('appLocale'),
  writeDelay: main.get('writeDelay')
}), {setIntl, setWriteDelay})
@injectIntl
@injectF
export default class PageSettings extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    appLocale: PropTypes.string.isRequired,
    setIntl: PropTypes.func.isRequired,
    writeDelay: PropTypes.number.isRequired,
    setWriteDelay: PropTypes.func.isRequired
  };

  renderLangMenuItems(key) {
    return APP_LANGS.map(({value, text}) => {
      return <MenuItem key={`${key}-${value}`} value={value} primaryText={text} />;
    });
  }

  handleLangSelectFieldChange = (event, index, value) => {
    this.props.setIntl(value);
  };

  handleWriteDelaySliderChange = (event, newValue) => {
    this.props.setWriteDelay(newValue);
  };

  render() {

    const {appLocale, f, writeDelay} = this.props;

    return (
      <div className={styles.pageSettings}>
        <h2>{f('settings')}</h2>
        <div>
          <LanguageIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <SelectField floatingLabelStyle={{fontSize: '20px'}} floatingLabelText={f('app-language')} onChange={this.handleLangSelectFieldChange} value={appLocale}>
            {this.renderLangMenuItems('site-lang')}
          </SelectField>
        </div>
        <div className={c(styles.field, styles.emptyIcon)}>
          <span className={styles.label}>{f('write-delay-with-num', {writeDelay: `${writeDelay}`})}</span>
          <Slider step={1} style={{width: 240}} min={0} max={1000} defaultValue={writeDelay} onChange={this.handleWriteDelaySliderChange} />
        </div>
      </div>
    );
  }
}
