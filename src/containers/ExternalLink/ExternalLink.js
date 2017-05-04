import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {openExternal} from './../../redux/modules/main';

@connect(() => ({}), {openExternal})
export default class ExternalLink extends Component {

  static propTypes = {
    children: PropTypes.any,
    href: PropTypes.string.isRequired,
    openExternal: PropTypes.func.isRequired
  };

  handleTouchTap = () => {
    const {href, openExternal} = this.props;
    openExternal(href);
  };

  render() {
    const {href, children} = this.props;
    return <a onTouchTap={this.handleTouchTap}>{children || href}</a>;
  }
}
