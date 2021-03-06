import test from 'ava';
import React from 'react';
import PropTypes from 'prop-types';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import AppConatiner, {App} from './../../../src/containers/App/App';
import mockStore from './../../helpers/mockStore';
import muiTheme from './../../../src/constants/muiTheme';
import touchTap from './../../helpers/touchTap';

let store;
let props;
let options;

test.beforeEach((t) => {
  store = mockStore({});
  props = {
    appLocale: 'bo',
    appFont: 'Tibetan Machine Uni',
    f: (str) => str,
    isDrawerOpen: false,
    isLoadingAuth: false,
    isSnackBarOpen: false,
    login: () => {},
    logout: () => {},
    push: () => {},
    setDrawerOpen: () => {},
    getAppVersion: () => {},
    setIntl: () => {},
    setSnackBarParams: () => {},
    interfaceFontSizeScalingFactor: 1,
    snackBarMessage: ''
  };

  options = {
    context: {
      store,
      muiTheme
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      muiTheme: PropTypes.object.isRequired
    },
  };
});

test('App should render language class name properly', (t) => {

  const wrapper = shallow((
    <App {...props}>
      <div>Hello World</div>
    </App>
  ));

  t.true(wrapper.children().hasClass('bo'));
});

test('App should handle menu item touch tap', (t) => {

  props.isDrawerOpen = true;
  props.setDrawerOpen = sinon.spy();

  const wrapper = mount((
    <App {...props}>
      <div>Hello World</div>
    </App>
  ), options);

  const menuItem = wrapper.find(MenuItem).find('span').first();
  touchTap(menuItem);

  t.true(props.setDrawerOpen.calledOnce);
});

test('should open side menu', (t) => {

  props.setDrawerOpen = sinon.spy();

  const wrapper = mount((
    <App {...props}>
      <div>Hello World</div>
    </App>
  ), options);

  const appBar = wrapper.find(AppBar).find('button[type="button"]').first();
  touchTap(appBar);

  t.true(props.setDrawerOpen.calledOnce);
});
