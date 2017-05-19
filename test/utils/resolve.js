import test from 'ava';
import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {mount} from 'enzyme';
import configureMockStore from 'redux-mock-store';

import {Provider} from 'react-redux';
import resolve from './../../src/helpers/resolve';
import muiTheme from './../../src/constants/muiTheme';
const mockStore = configureMockStore([]);

test('resolve should render loading indicator when promise is pending', async (t) => {

  const store = mockStore({});
  const func = () => new Promise(() => {});

  @resolve(func)
  class MyComponent extends Component {

    render() {
      return (
        <div>works</div>
      );
    }
  }

  const wrapper = mount(<MyComponent />, {
    context: {
      store,
      muiTheme
    },
    childContextTypes: {
      store: React.PropTypes.object.isRequired,
      muiTheme: React.PropTypes.object.isRequired,
    },
  });

  t.is(wrapper.find('div[mode]').length, 1);
});
