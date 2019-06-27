import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import Stats from '@/components/Stats';

const localVue = createLocalVue();

var store, wrapper;

jest.mock('@/store', () => ({
  getters: {
    armyList: 'an army list',
    upgrades: {
      'an upgrade': {}
    }
  }
}));

localVue.use(Vuex);

describe('Stats.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        pointsCost: () => 50,
        unitCount: () => 1,
        units: () => ({
          'a unit': {},
          'another unit': {},
        }),
        usedUnits: () => ({
          'a third unit': {
            upgrades: {
              'another upgrade': {}
            }
          }
        })
      }
    });

    wrapper = shallowMount(Stats, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('caption').text()).toEqual('an army list Army Selector');
    expect(wrapper.find('statline-stub:nth-child(1)').attributes('name')).toEqual('a unit');
    expect(wrapper.find('statline-stub:nth-child(2)').attributes('name')).toEqual('another unit');
    expect(wrapper.find('statline-stub:nth-child(3)').attributes('name')).toEqual('an upgrade');
  });

  it('renders used', () => {
    wrapper = shallowMount(Stats, { localVue, store, propsData: { used: true } });
    expect(wrapper.find('caption').text()).toEqual('Stats Used');
    expect(wrapper.find('statline-stub:nth-child(1)').attributes('name')).toEqual('a third unit');
    expect(wrapper.find('statline-stub:nth-child(2)').attributes('name')).toEqual('another upgrade');
  });
});
