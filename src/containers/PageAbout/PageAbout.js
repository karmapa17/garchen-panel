import React, {Component, PropTypes} from 'react';
import {FormattedHTMLMessage} from 'react-intl';

import injectF from './../../utils/injectF';

const styles = require('./PageAbout.scss');

@injectF
export default class PageAbout extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
  };

  render() {
    const {f} = this.props;
    return (
      <div className={styles.pageAbout}>
        <h2>{f('about-heading')}</h2>
        <p>Version 0.0.56</p>
        <div className={styles.aboutContent}>
          <FormattedHTMLMessage id="about-content" />
        </div>
      </div>
    );
  }
}
