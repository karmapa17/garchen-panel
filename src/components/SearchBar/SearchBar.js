import React, {Component, PropTypes} from 'react';
import {debounce} from 'lodash';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import ActionClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

import injectF from './../../helpers/injectF';
import hasValue from './../../helpers/hasValue';

const styles = require('./SearchBar.scss');

@injectF
export default class SearchBar extends Component {

  static propTypes = {
    f: PropTypes.func.isRequired,
    selectedSearchType: PropTypes.string,
    searchTypes: PropTypes.array,
    onInputChange: PropTypes.func.isRequired,
    onClearFilterButtonTouchTap: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    matchedCount: PropTypes.number.isRequired,
    onSearchTypeChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: ''
    };
  }

  static defaultProps = {
    searchTypes: []
  };

  debouncedInputChange = debounce((event) => {
    this.props.onInputChange(event.target.value);
  }, 1000);

  handleInputChange = (event) => {
    event.persist();
    this.setState({searchKeyword: event.target.value});
    this.debouncedInputChange(event);
  };

  clear() {
    this.setState({searchKeyword: ''});
  }

  renderMatchedMessage() {
    const {f, searchKeyword, matchedCount, onClearFilterButtonTouchTap} = this.props;
    if (hasValue(searchKeyword)) {
      return (
        <div className={styles.matchedMessage}>
          <span>{f('matched-message', {keyword: searchKeyword, count: `${matchedCount}`})}</span>
          <FlatButton label={f('clear-filter')} icon={<ActionClose />} style={{marginLeft: 14}}
            onTouchTap={onClearFilterButtonTouchTap} />
        </div>
      );
    }
  }

  renderSearchTypes() {

    const {f, searchTypes, selectedSearchType, onSearchTypeChange} = this.props;

    if (0 === searchTypes.length) {
      return false;
    }
    const items = searchTypes.map((type) => {
      return <MenuItem value={type} key={`search-menu-item-${type}`} primaryText={f(type)} />;
    });
    return <SelectField value={selectedSearchType} onChange={onSearchTypeChange} style={{width: 160}}>{items}</SelectField>;
  }

  render() {
    const {searchKeyword} = this.state;
    const {f} = this.props;
    return (
      <div className={styles.localSearchBar}>
        <TextField className={styles.searchInput} hintText={f('search-entries')} onChange={this.handleInputChange} value={searchKeyword} />
        {this.renderSearchTypes()}
        {this.renderMatchedMessage()}
      </div>
    );
  }
}
