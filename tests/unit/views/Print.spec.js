import { shallowMount, createLocalVue } from '@vue/test-utils'

import Print from '@/views/Print.vue';

var wrapper;

describe('Print.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Print, { });
  });

  it('renders', () => {
    expect(wrapper.text()).toEqual('Print');
  });
});
