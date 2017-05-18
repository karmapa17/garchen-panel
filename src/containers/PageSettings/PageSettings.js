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
import {setIntl, setAppFont, setWriteDelay, setInterfaceFontSizeScalingFactor, setContentFontSizeScalingFactor} from './../../redux/modules/main';
import injectF from './../../helpers/injectF';
import INTERFACE_FONT_SIZE_OPTIONS from './../../constants/interfaceFontSizeOptions';
import DEMO_FONT_PHRASES from './../../constants/demoFontPhrases';
import CONTENT_FONT_SIZE_OPTIONS from './../../constants/contentFontSizeOptions';
import Heading from './../Heading/Heading';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./PageSettings.scss');

@connect(({main}) => ({
  appLocale: main.get('appLocale'),
  appFont: main.get('appFont'),
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  contentFontSizeScalingFactor: main.get('contentFontSizeScalingFactor'),
  writeDelay: main.get('writeDelay')
}), {setIntl, setWriteDelay, setAppFont, setInterfaceFontSizeScalingFactor, setContentFontSizeScalingFactor})
@injectIntl
@injectF
export default class PageSettings extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    appLocale: PropTypes.string.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    contentFontSizeScalingFactor: PropTypes.number.isRequired,
    appFont: PropTypes.string.isRequired,
    setIntl: PropTypes.func.isRequired,
    setInterfaceFontSizeScalingFactor: PropTypes.func.isRequired,
    setContentFontSizeScalingFactor: PropTypes.func.isRequired,
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

  renderInterfaceFontSizeMenuItems() {
    const {f} = this.props;
    return INTERFACE_FONT_SIZE_OPTIONS.map(({textId, value}) => {
      return <MenuItem key={`option-interface-font-size-${textId}`} value={value} primaryText={f(textId)} />;
    });
  }

  renderContentFontSizeMenuItems() {
    const {f} = this.props;
    return CONTENT_FONT_SIZE_OPTIONS.map(({textId, value}) => {
      return <MenuItem key={`option-content-font-size-${textId}`} value={value} primaryText={f(textId)} />;
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

  handleInterfaceFontSizeSelectFieldChange = (event, index, value) => {
    this.props.setInterfaceFontSizeScalingFactor(value);
  };

  handleContentFontSizeSelectFieldChange = (event, index, value) => {
    this.props.setContentFontSizeScalingFactor(value);
  };

  renderDemoFontPhrasesListItems() {
    return DEMO_FONT_PHRASES.map(({lang, value}) => {
      return <li key={`list-item-demo-font-phrase-${lang}`}>{value}</li>;
    });
  }

  render() {

    const {appLocale, appFont, f, writeDelay, interfaceFontSizeScalingFactor, contentFontSizeScalingFactor} = this.props;
    const demoFontSize = getFontSize(contentFontSizeScalingFactor, 1);

    return (
      <div className={styles.pageSettings}>
        <Heading>{f('settings')}</Heading>
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
          <SelectField floatingLabelStyle={{fontSize: '20px'}} floatingLabelText={f('interface-font-size')}
            onChange={this.handleInterfaceFontSizeSelectFieldChange} value={interfaceFontSizeScalingFactor}>
            {this.renderInterfaceFontSizeMenuItems()}
          </SelectField>
        </div>
        <div className={styles.customField}>
          <FormatSizeIcon style={{marginRight: '21px', marginBottom: '12px'}} />
          <SelectField floatingLabelStyle={{fontSize: '20px'}} floatingLabelText={f('content-font-size')}
            onChange={this.handleContentFontSizeSelectFieldChange} value={contentFontSizeScalingFactor}>
            {this.renderContentFontSizeMenuItems()}
          </SelectField>
        </div>
        <ul className={styles.demoFontPhraseContainer} style={{fontSize: demoFontSize}}>{this.renderDemoFontPhrasesListItems()}</ul>
      </div>
    );
  }
}
