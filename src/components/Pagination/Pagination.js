import FlatButton from 'material-ui/FlatButton';
import React, {Component, PropTypes} from 'react';
import {range} from 'ramda';

const styles = require('./Pagination.scss');

const MAX_NUM = 10;
const LIMIT = MAX_NUM / 2;

export default class Pagination extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onButtonTouchTap: PropTypes.func.isRequired
  };

  hasNext() {
    const {current, total} = this.props;
    return current < total;
  }

  hasPrev() {
    return this.props.current > 1;
  }

  renderPageNums() {

    const {current, total} = this.props;

    let firstNum;
    let lastNum;

    if ((current - LIMIT > 1) && ((current + LIMIT - 1) < total)) {
      firstNum = current - LIMIT;
      lastNum = firstNum + MAX_NUM - 1;
    }
    else if ((1 <= current) && (current <= MAX_NUM)) {
      firstNum = 1;
      lastNum = MAX_NUM;
    }
    else if (((total - MAX_NUM + 1) <= current) && (current <= total)) {
      lastNum = total;
      firstNum = total - MAX_NUM + 1;
    }

    if (firstNum < 1) {
      firstNum = 1;
    }

    if (lastNum > total) {
      lastNum = total;
    }

    return range(firstNum, lastNum + 1).map((num) => {
      return (
        <li key={`pager-num-${num}`}>
          <FlatButton primary={(current === num)} onTouchTap={this.handleTouchTap(num)}>{num}</FlatButton>
        </li>
      );
    });
  }

  handleTouchTap = (page) => {
    return () => this.props.onButtonTouchTap(page);
  };

  render() {

    const {current} = this.props;

    return (
      <ul className={styles.pagination}>
        {this.hasPrev() && <li>
          <FlatButton onTouchTap={this.handleTouchTap(current - 1)}>Prev</FlatButton>
        </li>}
        {this.renderPageNums()}
        {this.hasNext() && <li>
          <FlatButton onTouchTap={this.handleTouchTap(current + 1)}>Next</FlatButton>
        </li>}
      </ul>
    );
  }
}
