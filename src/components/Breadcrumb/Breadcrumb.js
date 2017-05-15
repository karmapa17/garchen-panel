import React, {Component, PropTypes} from 'react';
import {isFunction} from 'lodash';

const styles = require('./Breadcrumb.scss');

export default class Breadcrumb extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ])
  };

  renderListContent() {

    const {children} = this.props;

    if (isFunction(children.map)) {
      return children.map((child, index) => {
        return <li key={`breadcrumb-item-${index}`}>{child}</li>;
      });
    }
    return <li key="breadcrumb-item">{children}</li>;
  }

  render() {
    return <ul className={styles.breadcrumb}>{this.renderListContent()}</ul>;
  }
}
