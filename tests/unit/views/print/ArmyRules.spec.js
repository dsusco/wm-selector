import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import ArmyRules from '@/views/print/ArmyRules';

const localVue = createLocalVue();

var store, wrapper;

localVue.use(Vuex);

describe('ArmyRules.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        armyRules: () => [
          {
            id: 'an ID',
            text: ['text 1']
          },
          {
            text: ['text 2']
          }
        ]
      }
    });

    wrapper = shallowMount(ArmyRules, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.text()).toContain('an ID');
    expect(wrapper.text()).toContain('text 1');
    expect(wrapper.text()).toContain('text 2');
  });
});
