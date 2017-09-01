import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import injectF from './../../utils/injectF';

const styles = require('./PageAbout.scss');

@connect(({main}) => ({
  appVersion: main.get('appVersion')
}))
@injectF
export default class PageAbout extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    appVersion: PropTypes.string.isRequired
  };

  render() {
    const {f, appVersion} = this.props;
    return (
      <div className={styles.pageAbout}>
        <h2>{f('about-version', {appVersion})}</h2>
      </div>
    );
  }
}
