import { shallowMount } from '@vue/test-utils'

import Selector from '@/views/Selector.vue';

var wrapper;

describe('Selector.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Selector, { });
  });

  it('renders', () => {
    expect(wrapper.text()).toEqual('Selector');
  });
});
