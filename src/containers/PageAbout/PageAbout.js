import React, {Component} from 'react';

const styles = require('./PageAbout.scss');

export default class PageAbout extends Component {

  render() {
    return (
      <div className={styles.pageAbout}>
        <h1>About</h1>
      </div>
    );
  }
}
