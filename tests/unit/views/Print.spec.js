import { shallowMount } from '@vue/test-utils'

import Print from '@/views/Print';

var wrapper;

describe('Print.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Print, { });
  });

  it('renders', () => {
    expect(wrapper.find('.print-view').attributes('id')).toEqual('main');
  });
});
