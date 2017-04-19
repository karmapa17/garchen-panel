import React, {Component, PropTypes} from 'react';

const styles = require('./TopBar.scss');

export default class TopBar extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return <div className={styles.topBar}>{this.props.children}</div>;
  }
}
