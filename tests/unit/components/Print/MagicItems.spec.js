import { shallowMount } from '@vue/test-utils';

import MagicItems from '@/components/Print/MagicItems';

var wrapper;

jest.mock('@/json/magic-items.json', () => ({
  upgrades: {
    'Item 1': { text: ['text 1'] },
    'Item 2': { text: ['text 2'] }
  }
}));

jest.mock('@/store', () => ({
  getters: {
    upgrades: {
      'Item 1': {
        number: 0,
        text: ['text 1']
      },
      'Item 2': {
        number: 1,
        text: ['text 2']
      }
    }
  }
}));

describe('MagicItems.vue', () => {
  it('renders', () => {
    wrapper = shallowMount(MagicItems, {});
    expect(wrapper.text()).toContain('Magic Items');
    expect(wrapper.text()).toContain('Item 1 text 1');
    expect(wrapper.text()).toContain('Item 2 text 2');
  });

  it('renders used', () => {
    wrapper = shallowMount(MagicItems, { propsData: { used: true } });
    expect(wrapper.text()).toContain('Magic Items Used');
    expect(wrapper.text()).not.toContain('Item 1 text 1');
    expect(wrapper.text()).toContain('Item 2 text 2');
  });
});
