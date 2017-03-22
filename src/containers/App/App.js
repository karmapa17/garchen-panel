import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Nav, NavItem, Navbar} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import {setIntl} from './../../redux/modules/main';

const styles = require('./App.scss');

@connect(() => ({}), {setIntl})
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    setIntl: PropTypes.func.isRequired
  };

  render() {

    const {children} = this.props;

    return (
      <div className={styles.app}>

        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink title="garchen panel" to="/">
                <span className="brand-title">garchen panel</span>
              </IndexLink>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav navbar>
              <LinkContainer to="/folders" key={`nav-item-folders`}>
                <NavItem>folders</NavItem>
              </LinkContainer>
              <LinkContainer to="/about" key={`nav-item-about`}>
                <NavItem>about</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <h1>
          <FormattedMessage id="garchen" />
        </h1>
        <div className={styles.appContent}>{children}</div>
      </div>
    );
  }
}
