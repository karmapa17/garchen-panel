import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Nav, NavItem, Navbar} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

const styles = require('./App.scss');

@connect(() => ({}))
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
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
