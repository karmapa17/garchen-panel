import React, {Component, PropTypes} from 'react';
import {debounce} from 'lodash';

import injectF from './../../helpers/injectF';

const styles = require('./LocalSearchBar.scss');

@injectF
export default class LocalSearchBar extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  };

  debouncedChange = debounce((event) => {
    this.props.onChange(event.target.value);
  }, 1000);

  handleChange = (event) => {
    event.persist();
    this.debouncedChange(event);
  };

  render() {
    const {f} = this.props;
    return (
      <div className={styles.localSearchBar}>
        <input className={styles.input} type="text" onChange={this.handleChange} placeholder={f('search-source-entry-or-page-num')} />
      </div>
    );
  }
}
