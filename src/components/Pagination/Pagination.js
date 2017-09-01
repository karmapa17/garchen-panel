import FlatButton from 'material-ui/FlatButton';
import React, {Component, PropTypes} from 'react';
import {range} from 'ramda';

import injectF from './../../utils/injectF';
import {COLOR_LINK_EX} from './../../constants/constants';

const styles = require('./Pagination.scss');

const MAX_NUM = 10;
const LIMIT = MAX_NUM / 2;

@injectF
export default class Pagination extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
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
      const isCurrent = (current === num);
      const buttonStyle = isCurrent ? {textDecoration: 'underline', color: COLOR_LINK_EX} : {};
      return (
        <li key={`pager-num-${num}`}>
          <FlatButton label={num} primary={isCurrent} style={buttonStyle} onTouchTap={this.handleTouchTap(num)} />
        </li>
      );
    });
  }

  handleTouchTap = (page) => {
    return () => this.props.onButtonTouchTap(page);
  };

  render() {

    const {current, f} = this.props;

    return (
      <ul className={styles.pagination}>
        {this.hasPrev() && <li>
          <FlatButton label={f('prev-page')} onTouchTap={this.handleTouchTap(current - 1)} />
        </li>}
        {this.renderPageNums()}
        {this.hasNext() && <li>
          <FlatButton label={f('next-page')} onTouchTap={this.handleTouchTap(current + 1)} />
        </li>}
      </ul>
    );
  }
}
