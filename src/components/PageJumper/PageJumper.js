import React, {Component, PropTypes} from 'react';

import injectF from './../../utils/injectF';

const styles = require('./PageJumper.scss');

export default class PageJumper extends Component {

  static propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onInputSubmit: PropTypes.func.isRequired
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const inputPageNum = parseInt(this.refs.input.value, 10);
    this.props.onInputSubmit(inputPageNum);
  };

  render() {

    const {current, total} = this.props;

    return (
      <div className={styles.pageJumper}>
        <form onSubmit={this.handleSubmit}>
          <input ref="input" type="number" name="page" min="1" max={total} defaultValue={current} />
          <span>&#47;{total}</span>
        </form>
      </div>
    );
  }
}
