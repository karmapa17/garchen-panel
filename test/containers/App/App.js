import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import AppConatiner, {App} from './../../../src/containers/App/App';

test('App should render language class name properly', (t) => {

  const props = {
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
  const wrapper = shallow((
    <App {...props}>
      <div>Hello World</div>
    </App>
  ));

  t.true(wrapper.children().hasClass('bo'));
});
