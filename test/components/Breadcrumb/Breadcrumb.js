import test from 'ava';
import React from 'react';
import {shallow, mount} from 'enzyme';

import Breadcrumb from './../../../src/components/Breadcrumb/Breadcrumb';

test('Breadcrumb should render properly', (t) => {

  const wrapper = shallow((
    <Breadcrumb>
      <a href="#link1">link1</a>
      <a href="#link2">link2</a>
    </Breadcrumb>
  ));

  t.is(wrapper.find('ul').children('li').length, 2);
});

test('Breadcrumb.renderListContent should render single child', (t) => {

  const wrapper = shallow((
    <Breadcrumb>
      <a href="#link1">link1</a>
    </Breadcrumb>
  ));

  const listContent = wrapper.instance().renderListContent();

  t.is(listContent.key, 'breadcrumb-item');
});
