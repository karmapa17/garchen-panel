import React, {Component, PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import TimerIcon from 'material-ui/svg-icons/image/timer';
import TextFormatIcon from 'material-ui/svg-icons/content/text-format';
import FormatListNumberIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import Slider from 'material-ui/Slider';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import APP_LANGS from './../../constants/appLangs';
import APP_FONTS from './../../constants/appFonts';
import {setIntl, setAppFont, setWriteDelay, setInterfaceFontSizeScalingFactor, setContentFontSizeScalingFactor} from './../../redux/modules/main';
import {setDisplayFolderPerPage, setDisplayDeletedFolderPerPage} from './../../redux/modules/folder';
import {setDisplayEntryPerPage} from './../../redux/modules/entry';
import {clearCachePageEntries, clearCachePageFolders} from './../../redux/modules/cache';
import injectF from './../../helpers/injectF';
import DISPLAY_FOLDER_PERPAGE_OPTIONS from './../../constants/displayFolderPerPageOptions';
import DISPLAY_ENTRY_PERPAGE_OPTIONS from './../../constants/displayEntryPerPageOptions';
import DISPLAY_DELETED_FOLDER_PERPAGE_OPTIONS from './../../constants/displayDeletedFolderPerPageOptions';
import Heading from './../Heading/Heading';

const styles = require('./PageSettings.scss');
const iconStyle = {
  marginRight: '21px',
  marginBottom: '12px'
};

@connect(({main, folder, entry}) => ({
  displayEntryPerPage: entry.get('perpage'),
  displayFolderPerPage: folder.get('perpage'),
  displayDeletedFolderPerPage: folder.get('deletedFolderPerPage'),
  appLocale: main.get('appLocale'),
  appFont: main.get('appFont'),
  writeDelay: main.get('writeDelay')
}), {setIntl, setWriteDelay, setAppFont, setInterfaceFontSizeScalingFactor, setContentFontSizeScalingFactor,
  setDisplayFolderPerPage, setDisplayEntryPerPage, clearCachePageEntries, clearCachePageFolders, setDisplayDeletedFolderPerPage})
@injectIntl
@injectF
export default class PageSettings extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    appLocale: PropTypes.string.isRequired,
    appFont: PropTypes.string.isRequired,
    setIntl: PropTypes.func.isRequired,
    setInterfaceFontSizeScalingFactor: PropTypes.func.isRequired,
    setContentFontSizeScalingFactor: PropTypes.func.isRequired,
    setAppFont: PropTypes.func.isRequired,
    setDisplayFolderPerPage: PropTypes.func.isRequired,
    setDisplayEntryPerPage: PropTypes.func.isRequired,
    setDisplayDeletedFolderPerPage: PropTypes.func.isRequired,
    clearCachePageEntries: PropTypes.func.isRequired,
    clearCachePageFolders: PropTypes.func.isRequired,
    displayFolderPerPage: PropTypes.number.isRequired,
    displayDeletedFolderPerPage: PropTypes.number.isRequired,
    displayEntryPerPage: PropTypes.number.isRequired,
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

  handleDisplayFolderPerPageSelectFieldChange = (event, index, value) => {
    const {setDisplayFolderPerPage, clearCachePageFolders} = this.props;
    setDisplayFolderPerPage(value);
    clearCachePageFolders();
  };

  handleDisplayDeletedFolderPerPageSelectFieldChange = (event, index, value) => {
    this.props.setDisplayDeletedFolderPerPage(value);
  };

  handleDisplayEntryPerPageSelectFieldChange = (event, index, value) => {
    const {setDisplayEntryPerPage, clearCachePageEntries} = this.props;
    setDisplayEntryPerPage(value);
    clearCachePageEntries();
  };

  renderDisplayFolderPerPageMenuItems() {
    return DISPLAY_FOLDER_PERPAGE_OPTIONS.map((value) => {
      return <MenuItem key={`option-display-folder-perpage-${value}`} value={value} primaryText={value} />;
    });
  }

  renderDisplayDeletedFolderPerPageMenuItems() {
    return DISPLAY_DELETED_FOLDER_PERPAGE_OPTIONS.map((value) => {
      return <MenuItem key={`option-display-deleted-folder-perpage-${value}`} value={value} primaryText={value} />;
    });
  }

  renderDisplayEntryPerPageMenuItems() {
    return DISPLAY_ENTRY_PERPAGE_OPTIONS.map((value) => {
      return <MenuItem key={`option-display-entry-perpage-${value}`} value={value} primaryText={value} />;
    });
  }

  render() {

    const {appLocale, appFont, f, writeDelay, displayFolderPerPage, displayDeletedFolderPerPage, displayEntryPerPage} = this.props;
    const floatingLabelFontSize = '20px';
    const customLabelFontSize = '15px';
    const floatingLabelStyle = {fontSize: floatingLabelFontSize, whiteSpace: 'nowrap'};

    return (
      <div className={styles.pageSettings}>
        <Heading>{f('settings')}</Heading>
        <div className={styles.content}>
          <div>
            <LanguageIcon style={iconStyle} />
            <SelectField floatingLabelStyle={floatingLabelStyle} floatingLabelText={f('app-language')}
              onChange={this.handleLangSelectFieldChange} value={appLocale}>
              {this.renderLangMenuItems()}
            </SelectField>
          </div>
          <div className={styles.customField}>
            <TimerIcon style={iconStyle} />
            <div className={styles.field}>
              <span style={{fontSize: customLabelFontSize}} className={styles.label}>{f('write-delay-with-num', {writeDelay: `${writeDelay}`})}</span>
              <Slider sliderStyle={{marginTop: '7px', marginBottom: 0}} step={1} style={{width: 240}} min={0} max={1000} defaultValue={writeDelay} onChange={this.handleWriteDelaySliderChange} />
            </div>
          </div>
          <div>
            <TextFormatIcon style={iconStyle} />
            <SelectField floatingLabelStyle={floatingLabelStyle} floatingLabelText={f('app-font')}
              onChange={this.handleFontSelectFieldChange} value={appFont}>
              {this.renderFontMenuItems()}
            </SelectField>
          </div>
          <div className={styles.customField}>
            <FormatListNumberIcon style={iconStyle} />
            <SelectField floatingLabelStyle={floatingLabelStyle}
             floatingLabelText={f('display-folder-perpage', {perpage: displayFolderPerPage})}
              onChange={this.handleDisplayFolderPerPageSelectFieldChange} value={displayFolderPerPage}>
              {this.renderDisplayFolderPerPageMenuItems()}
            </SelectField>
          </div>
          <div className={styles.customField}>
            <FormatListNumberIcon style={iconStyle} />
            <SelectField floatingLabelStyle={floatingLabelStyle}
              floatingLabelText={f('display-deleted-folder-perpage', {perpage: displayDeletedFolderPerPage})}
              onChange={this.handleDisplayDeletedFolderPerPageSelectFieldChange} value={displayDeletedFolderPerPage}>
              {this.renderDisplayDeletedFolderPerPageMenuItems()}
            </SelectField>
          </div>
          <div className={styles.customField}>
            <FormatListNumberIcon style={iconStyle} />
            <SelectField floatingLabelStyle={floatingLabelStyle}
              floatingLabelText={f('display-entry-perpage', {perpage: displayEntryPerPage})}
              onChange={this.handleDisplayEntryPerPageSelectFieldChange} value={displayEntryPerPage}>
              {this.renderDisplayEntryPerPageMenuItems()}
            </SelectField>
          </div>
        </div>
      </div>
    );
  }
}
