import React, {Component, PropTypes} from 'react';

export default function injectPush(Target) {

  return class InjectedPush extends Component {

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    render() {
      return <Target {...this.props} push={this.context.router.push} />;
    }
  };
}
