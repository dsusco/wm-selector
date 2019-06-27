import { shallowMount } from '@vue/test-utils'

import Home from '@/views/Home';

var wrapper;

describe('Home.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Home, { });
  });

  it('renders', () => {
    expect(wrapper.find('h1').text()).toEqual('Warmaster Army Selector');
  });
});
