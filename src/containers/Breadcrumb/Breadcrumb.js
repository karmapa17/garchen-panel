import React, {Component, PropTypes} from 'react';
import {isFunction} from 'lodash';
import {connect} from 'react-redux';

import getFontSize from './../../helpers/getFontSize';

const styles = require('./Breadcrumb.scss');

export class Breadcrumb extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ]),
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired
  };

  static defaultProps = {
    interfaceFontSizeScalingFactor: 1
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
    const {interfaceFontSizeScalingFactor} = this.props;
    const fontSize = getFontSize(interfaceFontSizeScalingFactor, 1.1);
    return <ul style={{fontSize}} className={styles.breadcrumb}>{this.renderListContent()}</ul>;
  }
}

export default connect(({main}) => ({
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor')
}))(Breadcrumb);
