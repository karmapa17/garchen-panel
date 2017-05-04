import React, {Component} from 'react';

import injectF from './../../helpers/injectF';

const styles = require('./PageAbout.scss');

@injectF
export default class PageAbout extends Component {

  render() {
    const {f} = this.props;
    return (
      <div className={styles.pageAbout}>
        <h2>{f('about')}</h2>
      </div>
    );
  }
}
