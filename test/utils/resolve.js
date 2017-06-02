import test from 'ava';
import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import mockStore from './../helpers/mockStore';
import resolve from './../../src/helpers/resolve';
import muiTheme from './../../src/constants/muiTheme';

let store;

test.beforeEach((t) => {
  store = mockStore({});
});

test('resolve should render loading indicator when promise is pending', async (t) => {

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

test.cb('resolve should render have state.isResolved as true when promise is resolved', (t) => {

  const func = () => new Promise((resolve) => resolve('done'));

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

  setImmediate(() => {
    t.is(wrapper.state().isResolved, true);
    t.end();
  });
});

test.cb('resolve should render have state.isResolved as false when promise is rejected', (t) => {

  const func = () => new Promise((resolve, reject) => reject('dead'));

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

  setImmediate(() => {
    t.is(wrapper.state().isResolved, false);
    t.end();
  });
});
