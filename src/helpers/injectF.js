import React, {Component, PropTypes} from 'react';

// a shorthand code of formatMessage
export default function injectF(Target) {

  return class InjectedF extends Component {

    static propTypes = {
      intl: PropTypes.object.isRequired
    };

    render() {
      const {intl: {formatMessage}} = this.props;
      const f = (data) => {
        if ('string' === typeof data) {
          return formatMessage({id: data});
        }
        return formatMessage(data);
      };
      return <Target {...this.props} f={f} />;
    }
  };
}
