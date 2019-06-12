import { shallowMount } from '@vue/test-utils'

import Save from '@/views/Save';

var wrapper;

describe('Save.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Save, { });
  });

  it('renders', () => {
    expect(wrapper.text()).toEqual('Save');
  });
});
