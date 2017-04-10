import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import injectTapEventPlugin from 'react-tap-event-plugin'

import {setIntl} from './../../redux/modules/main';
import muiTheme from './../../constants/muiTheme';
const styles = require('./App.scss');

injectTapEventPlugin()

@connect(() => ({}), {setIntl})
export default class App extends Component {

  static propTypes = {
    isLoadingAuth: PropTypes.bool.isRequired,
    auth: PropTypes.object,
    children: PropTypes.object.isRequired,
    setIntl: PropTypes.func.isRequired
  };

  renderElementRight() {

    const {auth, isLoadingAuth, login, logout} = this.props;

    if (isLoadingAuth) {
      return <CircularProgress mode="indeterminate" color="white" style={{marginTop: '16px', marginRight: '12px'}} size={30} />
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
    return <FlatButton style={{marginTop: '14px'}} onClick={login} label="Login" />;
  }

  render() {

    const {children} = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <AppBar title="Garchen Panel" iconElementRight={this.renderElementRight()}
          titleStyle={{cusror: 'pointer'}} iconStyleRight={{marginTop: 0, marginRight: 0, marginLeft: 0}}
          onLeftIconButtonTouchTap={this.handleHamburgerTouchTap} onTitleTouchTap={this.handleTitleTouchTap} />

          <div className="app-content">{children}</div>
        <div className={styles.app}>
          <div className={styles.appContent}>{children}</div>
        </div>
      </MuiThemeProvider>
    );
  }
}
