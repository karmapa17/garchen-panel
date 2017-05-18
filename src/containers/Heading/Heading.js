import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import getFontSize from './../../helpers/getFontSize';

@connect(({main}) => ({
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor')
}))
export default class Heading extends Component {

  static propTypes = {
    children: PropTypes.any.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired
  };

  render() {
    const {interfaceFontSizeScalingFactor, children} = this.props;
    const style = {
      fontSize: getFontSize(interfaceFontSizeScalingFactor, 1.1)
    };
    return <h2 style={style}>{children}</h2>;
  }
}
