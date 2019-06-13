import { shallowMount } from '@vue/test-utils';

import Text from '@/views/Text';

var wrapper;

describe('Text.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Text, { });
  });

  it('renders', () => {
    expect(wrapper.find('.text-view').attributes('id')).toEqual('main');
  });
});
