import React, {Component, PropTypes} from 'react';

import injectF from './../../helpers/injectF';
import Heading from './../Heading/Heading';

const styles = require('./PageAbout.scss');

@injectF
export default class PageAbout extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired
  };

  render() {
    const {f} = this.props;
    return (
      <div className={styles.pageAbout}>
        <Heading>{f('about')}</Heading>
      </div>
    );
  }
}
