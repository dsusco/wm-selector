import { shallowMount } from '@vue/test-utils';

import SpecialRules from '@/components/Print/SpecialRules';

var wrapper;

jest.mock('@/store', () => ({
  getters: {
    specialRules: {
      'Rule 1': {
        order: 1,
        text: ['text 1']
      },
      'Rule 2': {
        order: 2,
        text: ['text 2']
      }
    },
    units: {
      'unit 1': {
        number: 0,
        specialRules: ['Rule 1']
      },
      'unit 2': {
        number: 1,
        specialRules: ['Rule 2']
      }
    },
    upgrades: {
      'upgrade 1': {
        number: 1,
        specialRules: ['Rule 1']
      },
      'upgrade 2': {
        number: 0,
        specialRules: ['Rule 2']
      }
    }
  }
}));

describe('SpecialRules.vue', () => {
  it('renders', () => {
    wrapper = shallowMount(SpecialRules, {});
    expect(wrapper.text()).toContain('Special Rules');
    expect(wrapper.text()).toContain('1. Rule 1 text 1');
    expect(wrapper.text()).toContain('2. Rule 2 text 2');
  });

  it('renders used', () => {
    wrapper = shallowMount(SpecialRules, { propsData: { used: true } });
    expect(wrapper.text()).toContain('Special Rules Used');
    expect(wrapper.text()).toContain('1. Rule 1 text 1');
    expect(wrapper.text()).toContain('2. Rule 2 text 2');
  });
});
