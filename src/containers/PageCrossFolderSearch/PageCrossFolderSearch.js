import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import injectF from './../../helpers/injectF';
import Heading from './../Heading/Heading';

const styles = require('./PageCrossFolderSearch.scss');

@connect(({}) => ({
}))
@injectF
export default class PageCrossFolderSearch extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired
  };

  render() {
    const {f} = this.props;
    return (
      <div className={styles.pageCrossFolderSearch}>
        <Heading>{f('cross-folder-search')}</Heading>
      </div>
    );
  }
}
