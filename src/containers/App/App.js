import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {APP_NAME} from './../constants/Constants';
import Counter from './../components/Counter/Counter';
import {add} from './../modules/main';
import {mapConnect} from './../../helpers';

@connect((state) => mapConnect(state, {
  counterValue: 'main.counterValue'
}), {add})
export default class App extends Component {

  static PropTypes = {
    counterValue: PropTypes.number.isRequired,
    add: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <h1>{APP_NAME}</h1>
        <Counter value={this.props.counterValue} onBtnAddClick={this.props.add} />
      </div>
    );
  }
}
