import React, {Component, PropTypes} from 'react';

const styles = require('./Counter.scss');

export default class Counter extends Component {

  static PropTypes = {
    value: PropTypes.number.isRequired,
    onBtnAddClick: PropTypes.func.isRequired
  };

  render() {

    return (
      <div className={styles.counter}>
        <button onClick={this.props.onBtnAddClick}>add</button>
        <span className={styles.counterValue}>{this.props.value}</span>
      </div>
    );
  }
}
