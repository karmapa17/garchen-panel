import React, {Component} from 'react';

const styles = require('./PageNotFound.scss');

export default class PageNotFound extends Component {

  render() {
    return (
      <div className={styles.pageNotFound}>
        <h1>Page Not Found.</h1>
      </div>
    );
  }
}
