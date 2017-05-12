import React, {Component, PropTypes} from 'react';
import {injectIntl} from 'react-intl';

// a shorthand code of formatMessage
export default function injectF(Target) {

  class InjectedF extends Component {

    static propTypes = {
      intl: PropTypes.object.isRequired
    };

    getWrappedInstance() {
      return this.refs.target;
    }

    render() {
      const {intl: {formatMessage, formatHTMLMessage}} = this.props;

      const f = (data, params) => {
        if ('string' === typeof data) {
          return formatMessage({id: data}, params);
        }
        return formatMessage(data);
      };

      const fh = (data, params) => {
        if ('string' === typeof data) {
          return formatHTMLMessage({id: data}, params);
        }
        return formatHTMLMessage(data);
      };
      return <Target ref="target" {...this.props} f={f} fh={fh} />;
    }
  }
  return injectIntl(InjectedF, {withRef: true});
}
