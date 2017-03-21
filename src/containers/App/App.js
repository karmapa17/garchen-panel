import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {IndexLink} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Nav, NavItem, Navbar} from 'react-bootstrap';

import {APP_NAME} from './../../constants/Constants';
import Counter from './../../components/Counter/Counter';
import {add} from './../../modules/main';
import {mapConnect} from './../../helpers';

@connect((state) => mapConnect(state, {
  counterValue: 'main.counterValue'
}), {add})
export default class App extends Component {

  static propTypes = {
    counterValue: PropTypes.number.isRequired,
    add: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container">

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

        <h1>{APP_NAME}</h1>
        <Counter value={this.props.counterValue} onBtnAddClick={this.props.add} />
      </div>
    );
  }
}
