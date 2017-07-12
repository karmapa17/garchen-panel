import React, {Component, PropTypes} from 'react';

import injectF from './../../helpers/injectF';

const styles = require('./PageJumper.scss');

@injectF
export default class PageJumper extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onButtonTouchTap: PropTypes.func.isRequired
  };

  renderInputPage() {
    const {current, total} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="number" name="page" min="1" max={total}
          ref={(input) => this.input = input} defaultValue={current} />
        <span>&#47;{total}</span>
      </form>
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {current} = this.props;
    const inputPageNum = parseInt(this.input.value, 10);
    const equal = inputPageNum - current;
    this.props.onButtonTouchTap(current + equal);
  };

  render() {
    return (
      <div className={styles.pageJumper}>
        {this.renderInputPage()}
      </div>
    );
  }
}
