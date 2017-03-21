import React, {Component} from 'react';

const styles = require('./PageHome.scss');

export default class PageHome extends Component {

  render() {
    return (
      <div className={styles.pageHome}>
        <h1>Home</h1>
      </div>
    );
  }
}
