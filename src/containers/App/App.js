import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, {Component, PropTypes} from 'react';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Snackbar from 'material-ui/Snackbar';
import c from 'classnames';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {connect} from 'react-redux';

import ipc from './../../helpers/ipc';
import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import muiTheme from './../../constants/muiTheme';
import {login, logout} from './../../redux/modules/auth';
import {setDrawerOpen, setSnackBarParams} from './../../redux/modules/ui';
import {setIntl} from './../../redux/modules/main';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./App.scss');

injectTapEventPlugin();

@connect(({auth, main, ui}) => ({
  appLocale: main.get('appLocale'),
  appFont: main.get('appFont'),
  auth: auth.get('auth'),
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  isDrawerOpen: ui.get('isDrawerOpen'),
  isLoadingAuth: auth.get('isLoadingAuth'),
  isSnackBarOpen: ui.get('isSnackBarOpen'),
  snackBarMessage: ui.get('snackBarMessage')
}), {setDrawerOpen, setIntl, setSnackBarParams, login, logout})
@injectF
@injectPush
export default class App extends Component {

  static propTypes = {
    appLocale: PropTypes.string.isRequired,
    appFont: PropTypes.string.isRequired,
    auth: PropTypes.object,
    children: PropTypes.object.isRequired,
    f: PropTypes.func.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    isLoadingAuth: PropTypes.bool.isRequired,
    isSnackBarOpen: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setDrawerOpen: PropTypes.func.isRequired,
    setIntl: PropTypes.func.isRequired,
    setSnackBarParams: PropTypes.func.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    snackBarMessage: PropTypes.string.isRequired,
  };

  handleCsvProcessingDone = (event, data) => {
    const {setSnackBarParams, f} = this.props;
    setSnackBarParams(true, f('csv-imported-done', {filename: data.filename}));
  };

  componentDidMount() {
    ipc.on('csv-processing-done', this.handleCsvProcessingDone);
  }

  componentWillUnmount() {
    ipc.off('csv-pocessing-done', this.handleCsvProcessingDone);
  }

  renderIconElementRight() {
    const {auth, isLoadingAuth, login, logout, f, interfaceFontSizeScalingFactor} = this.props;
    const fontSize = getFontSize(interfaceFontSizeScalingFactor, 1);

    if (isLoadingAuth) {
      return <CircularProgress mode="indeterminate" color="white" style={{marginTop: '16px', marginRight: '12px'}} size={30} />;
    }

    if (auth) {

      const {profile} = auth;
      const iconButtonStyle = {
        width: 'initial',
        height: 'initial',
        border: 0,
        paddingTop: '12px',
        paddingBottom: '12px',
        marginRight: 0,
        marginTop: 0
      };

      const iconButton = (
        <IconButton style={iconButtonStyle} disableTouchRipple>
          <Avatar src={profile.image.url} size={30} />
        </IconButton>
      );

      const menuItemStyle = {fontSize};

      return (
        <IconMenu
          iconButtonElement={iconButton}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
          <MenuItem primaryText={f('account')} onTouchTap={this.goToAccountPage} style={menuItemStyle} />
          <MenuItem primaryText={f('sign-out')} onTouchTap={logout} style={menuItemStyle} />
        </IconMenu>
      );
    }
    return <FlatButton style={{marginTop: '9px', color: '#fff'}} labelStyle={{fontSize}} onClick={login} label={f('login')} />;
  }

  handleDrawerChange = (open) => this.props.setDrawerOpen(open);

  handleHamburgerTouchTap = () => this.props.setDrawerOpen(true);

  handleMenuItemTouchTap = (route) => {
    return () => {
      this.props.setDrawerOpen(false);
      this.props.push(route);
    };
  };

  handleSnackBarRequestClose = () => this.props.setSnackBarParams(false);

  render() {

    const {children, isDrawerOpen, f, isSnackBarOpen, snackBarMessage, appLocale, appFont, interfaceFontSizeScalingFactor} = this.props;
    const titleFontSize = getFontSize(interfaceFontSizeScalingFactor, 1.4);
    const menuItemStyle = {
      fontSize: getFontSize(interfaceFontSizeScalingFactor, 1)
    };

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={c(styles.app, appLocale)} style={{fontFamily: appFont}}>

         <AppBar title={f('garchen')} iconElementRight={this.renderIconElementRight()}
            titleStyle={{fontSize: titleFontSize, cusror: 'pointer'}} iconStyleRight={{marginTop: 0, marginRight: 0, marginLeft: 0}}
            onLeftIconButtonTouchTap={this.handleHamburgerTouchTap} onTitleTouchTap={this.handleTitleTouchTap} />

          <div className={styles.appContent}>{children}</div>

          <Drawer docked={false} open={isDrawerOpen} onRequestChange={this.handleDrawerChange}>
            <MenuItem primaryText={f('folders')} style={menuItemStyle} onTouchTap={this.handleMenuItemTouchTap('/')} />
            <MenuItem primaryText={f('about')} style={menuItemStyle} onTouchTap={this.handleMenuItemTouchTap('/about')} />
            <MenuItem primaryText={f('import-csv-file')} style={menuItemStyle} onTouchTap={this.handleMenuItemTouchTap('/import-csv')} />

            <hr className="divider" />
            <MenuItem primaryText={f('settings')} style={menuItemStyle} leftIcon={(<SettingsIcon />)} onTouchTap={this.handleMenuItemTouchTap('/settings')} />
          </Drawer>
          <Snackbar open={isSnackBarOpen} message={snackBarMessage} autoHideDuration={4000} onRequestClose={this.handleSnackBarRequestClose} />
        </div>
      </MuiThemeProvider>
    );
  }
}
