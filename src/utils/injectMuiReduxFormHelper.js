import React, {Component, PropTypes} from 'react';

import createRenderTextField from './createRenderTextField';
import createRenderSelectField from './createRenderSelectField';

export default function injectMuiReduxFormHelper(Target) {

  return class InjectedReduxFormHelper extends Component {

    static propTypes = {
      f: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      const {f} = props;
      this.renderTextField = createRenderTextField(f);
      this.renderSelectField = createRenderSelectField(f);
    }

    render() {
      return <Target {...this.props} renderTextField={this.renderTextField} renderSelectField={this.renderSelectField} />;
    }
  };
}
