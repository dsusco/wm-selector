import { shallowMount } from '@vue/test-utils'

import Home from '@/views/Home.vue';

var wrapper;

describe('Home.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Home, { });
  });

  it('renders', () => {
    expect(wrapper.text()).toEqual('Warmaster Army Selector');
  });
});
