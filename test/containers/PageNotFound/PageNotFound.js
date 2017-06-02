import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import PageNotFound from './../../../src/containers/PageNotFound/PageNotFound';

test('PageNotFound should render properly', (t) => {

  const wrapper = shallow((
    <PageNotFound />
  ));

  t.is(wrapper.find('h1').length, 1);
});
