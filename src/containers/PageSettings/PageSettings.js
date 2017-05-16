import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import TimerIcon from 'material-ui/svg-icons/image/timer';
import TextFormatIcon from 'material-ui/svg-icons/content/text-format';
import FormatSizeIcon from 'material-ui/svg-icons/editor/format-size';
import Slider from 'material-ui/Slider';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import APP_LANGS from './../../constants/appLangs';
import APP_FONTS from './../../constants/appFonts';
import {setIntl, setAppFont, setWriteDelay, setInterfaceFontSize} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';

const styles = require('./PageSettings.scss');

@connect(({main}) => ({
  appLocale: main.get('appLocale'),
  appFont: main.get('appFont'),
  interfaceFontSize: main.get('interfaceFontSize'),
  writeDelay: main.get('writeDelay')
}), {setIntl, setWriteDelay, setAppFont, setInterfaceFontSize})
@injectIntl
@injectF
export default class PageSettings extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    appLocale: PropTypes.string.isRequired,
    interfaceFontSize: PropTypes.number.isRequired,
    appFont: PropTypes.string.isRequired,
    setIntl: PropTypes.func.isRequired,
    setInterfaceFontSize: PropTypes.func.isRequired,
    setAppFont: PropTypes.func.isRequired,
    writeDelay: PropTypes.number.isRequired,
    setWriteDelay: PropTypes.func.isRequired
  };

  renderLangMenuItems() {
    return APP_LANGS.map(({value, text}) => {
      return <MenuItem key={`option-lang-${value}`} value={value} primaryText={text} />;
    });
  }

  renderFontMenuItems() {
    return APP_FONTS.map(({value, text}) => {
      return <MenuItem key={`option-font-${value}`} value={value} primaryText={text} />;
    });
  }

  handleLangSelectFieldChange = (event, index, value) => {
    this.props.setIntl(value);
  };

  handleFontSelectFieldChange = (event, index, value) => {
    this.props.setAppFont(value);
  };

  handleWriteDelaySliderChange = (event, newValue) => {
    this.props.setWriteDelay(newValue);
  };

  handleInterfaceFontSizeSliderChange = (event, newValue) => {
    this.props.setInterfaceFontSize(newValue);
  };

  render() {

    const {appLocale, appFont, f, writeDelay, interfaceFontSize} = this.props;

    return (
      <div className={styles.pageSettings}>
        <h2>{f('settings')}</h2>
        <div>
          <LanguageIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <SelectField floatingLabelStyle={{fontSize: '20px'}} floatingLabelText={f('app-language')} onChange={this.handleLangSelectFieldChange} value={appLocale}>
            {this.renderLangMenuItems()}
          </SelectField>
        </div>
        <div className={styles.customField}>
          <TimerIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <div className={styles.field}>
            <span className={styles.label}>{f('write-delay-with-num', {writeDelay: `${writeDelay}`})}</span>
            <Slider sliderStyle={{marginTop: '7px', marginBottom: 0}} step={1} style={{width: 240}} min={0} max={1000} defaultValue={writeDelay} onChange={this.handleWriteDelaySliderChange} />
          </div>
        </div>
        <div>
          <TextFormatIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <SelectField floatingLabelStyle={{fontSize: '20px'}} floatingLabelText={f('app-font')} onChange={this.handleFontSelectFieldChange} value={appFont}>
            {this.renderFontMenuItems()}
          </SelectField>
        </div>
        <div className={styles.customField}>
          <FormatSizeIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <div className={styles.field}>
            <span className={styles.label}>{f('interface-font-size', {interfaceFontSize})}</span>
            <Slider sliderStyle={{marginTop: '7px', marginBottom: 0}} step={1} style={{width: 240}} min={12} max={48} defaultValue={interfaceFontSize} onChange={this.handleInterfaceFontSizeSliderChange} />
          </div>
        </div>
      </div>
    );
  }
}
