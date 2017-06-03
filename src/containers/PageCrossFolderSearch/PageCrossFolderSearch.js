import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import injectF from './../../helpers/injectF';
import injectPush from './../../helpers/injectPush';
import Heading from './../Heading/Heading';
import TopBar from './../../components/TopBar/TopBar';
import SearchBar from './../../components/SearchBar/SearchBar';
import {search} from './../../redux/modules/crossFolderSearch';
import {setCachePageCrossFolderSearch} from './../../redux/modules/cache';
import Pagination from './../../components/Pagination/Pagination';
import getFontSize from './../../helpers/getFontSize';

const styles = require('./PageCrossFolderSearch.scss');

@connect(({crossFolderSearch, cache, main}) => ({
  cache: cache.get('cachePageCrossFolderSearch'),
  total: crossFolderSearch.get('total'),
  interfaceFontSizeScalingFactor: main.get('interfaceFontSizeScalingFactor'),
  perpage: crossFolderSearch.get('perpage'),
  folders: crossFolderSearch.get('folders')
}), {search, setCachePageCrossFolderSearch})
@injectPush
@injectF
export default class PageCrossFolderSearch extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    interfaceFontSizeScalingFactor: PropTypes.number.isRequired,
    push: PropTypes.func.isRequired,
    perpage: PropTypes.number.isRequired,
    cache: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    setCachePageCrossFolderSearch: PropTypes.func.isRequired,
    folders: PropTypes.array.isRequired,
    f: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      searchKeyword: '',
      page: 1
    }, props.cache);
  }

  componentWillUpdate(nextProps, nextState) {
    const {page, searchKeyword} = this.state;
    const {perpage, search, setCachePageCrossFolderSearch} = this.props;

    const nextPage = nextState.page;
    const nextPerpage = nextProps.perpage;
    const nextSearchKeyword = nextState.searchKeyword;

    const shouldSearch = (page !== nextPage) || (perpage !== nextPerpage) ||
      (searchKeyword !== nextSearchKeyword);

    if (shouldSearch) {

      setCachePageCrossFolderSearch({
        page: nextPage,
        searchKeyword: nextSearchKeyword
      });

      search({
        page: nextPage,
        perpage: nextPerpage,
        searchKeyword: nextSearchKeyword.trim()
      });
    }
  }

  goToFoldersPage = () => this.props.push('/');

  handleClearSearchButtonTouchTap = () => {
    this.setState({searchKeyword: ''});
    this.refs.searchBar.getWrappedInstance().getWrappedInstance().clear();
  };

  handleSearchInputChange = (searchKeyword) => {
    if (this.state.searchKeyword !== searchKeyword) {
      this.setState({page: 1});
    }
    this.setState({searchKeyword});
  };

  handleFolderAnchorTouchTap = (folderId) => {
    return () => this.props.push(`/folders/${folderId}/entries`);
  };

  handleEntryAnchorTouchTap = (entry) => {
    return () => this.props.push(`/folders/${entry.folderId}/entries/${entry.id}`);
  };

  renderEntries(entries) {
    const anchorStyle = {fontSize: this.getContentFontSize()};
    const rows = entries.map((entry) => {
      return (
        <li key={`entry-row-${entry.id}`}>
          <a style={anchorStyle} onTouchTap={this.handleEntryAnchorTouchTap(entry)}>{entry.sourceEntry}</a>
        </li>
      );
    });
    return <ul className={styles.entryBox}>{rows}</ul>;
  }

  getContentFontSize() {
    const {interfaceFontSizeScalingFactor} = this.props;
    return getFontSize(interfaceFontSizeScalingFactor, 1.2);
  }

  renderFolders() {
    const anchorStyle = {fontSize: this.getContentFontSize()};
    const rows = this.props.folders.map(({id, name, entries}) => {
      return (
        <div key={`folder-row-${id}`} className={styles.folder}>
          <a style={anchorStyle} onTouchTap={this.handleFolderAnchorTouchTap(id)}>{name}</a>
          {this.renderEntries(entries)}
        </div>
      );
    });
    return <div className={styles.folderBox}>{rows}</div>;
  }

  handlePageButtonTouchTap = (page) => {
    this.setState({page});
  };

  render() {
    const {searchKeyword, page} = this.state;
    const {f, total, perpage} = this.props;

    return (
      <div className={styles.pageCrossFolderSearch}>
        <TopBar>
          <Heading>{f('cross-folder-search')}</Heading>
          <FlatButton icon={<CloseIcon />} onTouchTap={this.goToFoldersPage} />
        </TopBar>
        <SearchBar ref="searchBar" onInputChange={this.handleSearchInputChange}
          searchKeyword={searchKeyword} matchedCount={total} autoFocus
          onClearFilterButtonTouchTap={this.handleClearSearchButtonTouchTap} />
        {this.renderFolders()}
        {(total > perpage) && <Pagination current={page} total={Math.ceil(total / perpage)}
          onButtonTouchTap={this.handlePageButtonTouchTap} />}
      </div>
    );
  }
}
