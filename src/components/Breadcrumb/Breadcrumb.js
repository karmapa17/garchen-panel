import React, {Component, PropTypes} from 'react';

const styles = require('./Breadcrumb.scss');

export default class Breadcrumb extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired
  };

  renderListContent() {
    return this.props.children.map((child) => {
      return <li>{child}</li>;
    });
  }

  render() {
    return <ul className={styles.breadcrumb}>{this.renderListContent()}</ul>;
  }
}
