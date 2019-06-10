import { shallowMount, createLocalVue } from '@vue/test-utils'

import Text from '@/views/Text.vue';

var wrapper;

describe('Text.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Text, { });
  });

  it('renders', () => {
    expect(wrapper.text()).toEqual('Text');
  });
});
