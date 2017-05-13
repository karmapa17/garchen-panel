import test from 'ava';
import React from 'react';
import {shallow, mount} from 'enzyme';

import TopBar from './../../../src/components/TopBar/TopBar';

test('TopBar should render properly', (t) => {

  const wrapper = shallow((
    <TopBar>
      <p>Just a simple paragraph here.</p>
    </TopBar>
  ));

  t.is(wrapper.find('p').text(), 'Just a simple paragraph here.');
});
