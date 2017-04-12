import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {injectIntl} from 'react-intl';

import {setIntl, setDrawerOpen, toggleDrawerOpen} from './../../redux/modules/main';
import muiTheme from './../../constants/muiTheme';

const styles = require('./App.scss');

injectTapEventPlugin();

@connect(({auth, main}) => ({
  isDrawerOpen: main.get('isDrawerOpen'),
  isLoadingAuth: auth.get('isLoadingAuth'),
  auth: auth.get('auth')
}), {setDrawerOpen, toggleDrawerOpen, setIntl})
@injectIntl
export default class App extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isDrawerOpen: PropTypes.bool.isRequired,
    isLoadingAuth: PropTypes.bool.isRequired,
    login: PropTypes.func,
    logout: PropTypes.func,
    auth: PropTypes.object,
    toggleDrawerOpen: PropTypes.func.isRequired,
    setDrawerOpen: PropTypes.func.isRequired,
    setIntl: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired
  };

  renderIconElementRight() {
    const {auth, isLoadingAuth, login, logout, intl: {formatMessage}} = this.props;

    if (isLoadingAuth) {
      return <CircularProgress mode="indeterminate" color="white" style={{marginTop: '16px', marginRight: '12px'}} size={30} />;
    }

    if (auth) {

      const iconButton = (
        <IconButton style={{width: '64px', height: '64px', marginRight: 0}} disableTouchRipple>
          <div>
            <div className="hidden-mobile">
              <Avatar src={auth.photoURL} />
            </div>
            <div>
              <span className="hidden-mobile">{auth.displayName}</span>
            </div>
          </div>
        </IconButton>
      );

      return (
        <IconMenu
          iconButtonElement={iconButton}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
          <MenuItem primaryText="Account" onTouchTap={this.goToAccountPage} />
          <MenuItem primaryText="Sign out" onTouchTap={logout} />
        </IconMenu>
      );
    }
    return <FlatButton style={{marginTop: '14px', color: '#fff'}} onClick={login} label={formatMessage({id: 'login'})} />;
  }

  handleDrawerChange = (open) => this.props.setDrawerOpen(open);

  handleHamburgerTouchTap = () => this.props.toggleDrawerOpen();

  handleMenuItemTouchTap = (route) => {
    return () => {
      this.props.setDrawerOpen(false);
      this.context.router.push(route);
    };
  };

  render() {

    const {children, isDrawerOpen, intl: {formatMessage}} = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={styles.app}>

          <AppBar title={formatMessage({id: 'garchen'})} iconElementRight={this.renderIconElementRight()}
            titleStyle={{cusror: 'pointer'}} iconStyleRight={{marginTop: 0, marginRight: 0, marginLeft: 0}}
            onLeftIconButtonTouchTap={this.handleHamburgerTouchTap} onTitleTouchTap={this.handleTitleTouchTap} />

          <div className={styles.appContent}>{children}</div>

          <Drawer docked={false} open={isDrawerOpen} onRequestChange={this.handleDrawerChange}>
            <MenuItem primaryText={formatMessage({id: 'folders'})} onTouchTap={this.handleMenuItemTouchTap('/')} />
            <MenuItem primaryText={formatMessage({id: 'about'})} onTouchTap={this.handleMenuItemTouchTap('/about')} />

            <hr className="divider" />
            <MenuItem primaryText={formatMessage({id: 'settings'})} leftIcon={(<SettingsIcon />)} onTouchTap={this.handleMenuItemTouchTap('/settings')} />
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}
