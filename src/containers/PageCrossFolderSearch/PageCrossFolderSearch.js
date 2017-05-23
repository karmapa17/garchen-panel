import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import Heading from './../Heading/Heading';
import TopBar from './../../components/TopBar/TopBar';
import SearchBar from './../../components/SearchBar/SearchBar';

const styles = require('./PageCrossFolderSearch.scss');

@connect(({}) => ({
}))
@injectPush
@injectF
export default class PageCrossFolderSearch extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    f: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: '',
      page: 1
    };
  }

  goToFoldersPage = () => this.props.push('/');

  handleClearSearchButtonTouchTap = () => {
    this.setState({searchKeyword: ''});
    this.refs.searchBar.getWrappedInstance().getWrappedInstance().clear();
  };

  render() {
    const {searchKeyword} = this.state;
    const {f} = this.props;
    const matchedCount = 0;
    return (
      <div className={styles.pageCrossFolderSearch}>
        <TopBar>
          <Heading>{f('cross-folder-search')}</Heading>
          <FlatButton icon={<CloseIcon />} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange}
          searchKeyword={searchKeyword} matchedCount={matchedCount}
          onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
      </div>
    );
  }
}
