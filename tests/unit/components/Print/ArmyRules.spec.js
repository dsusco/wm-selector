import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import ArmyRules from '@/components/Print/ArmyRules';

const localVue = createLocalVue();

var store, wrapper;

localVue.use(Vuex);

describe('ArmyRules.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        armyRules: () => ['some army rule text']
      }
    });

    wrapper = shallowMount(ArmyRules, { localVue, store });
  });

  it('renders', () => {
    console.log(wrapper.html());
    expect(wrapper.html()).toContain('<p>some army rule text</p>');
  });
});
