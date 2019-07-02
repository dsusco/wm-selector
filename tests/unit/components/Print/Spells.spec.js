import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import Spells from '@/components/Print/Spells';

const localVue = createLocalVue();

var store, wrapper;

localVue.use(Vuex);

describe('Spells.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        spells: () => [{
          name: 'name',
          roll: 'roll',
          range: 'range',
          text: ['text']
        }]
      }
    });

    wrapper = shallowMount(Spells, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('.name').text()).toEqual('name');
    expect(wrapper.find('.roll').text()).toEqual('roll+ to cast');
    expect(wrapper.find('.range').text()).toEqual('Range range');
    expect(wrapper.find('.text').text()).toEqual('text');
  });
});
