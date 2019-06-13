import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import TextList from '@/views/print/TextList';

const localVue = createLocalVue();

var store, wrapper;

localVue.use(Vuex);

describe('TextList.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        armyList: () => 'an army list',
        label: () => 'a label',
        pointsCost: () => 50,
        unitCount: () => 1,
        units: () => ({
          a: {
            number: 1,
            pointsCost: 50,
            upgrades: {
              c: {
                number: 1,
                pointsCost: '+5'
              },
              d: {
                number: 0,
                pointsCost: '+10'
              }
            }
          },
          b: {
            number: 0,
            pointsCost: 0
          }
        }),
        usedUnits: () => ({
          a: {
            number: 1,
            pointsCost: 50,
            upgrades: {
              c: {
                number: 1,
                pointsCost: '+5'
              }
            }
          }
        }),
        version: () => 'a version'
      }
    });

    wrapper = shallowMount(TextList, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.text()).toContain('a label');
    expect(wrapper.text()).toContain('an army list');
    expect(wrapper.text()).toContain('50');
    expect(wrapper.text()).toContain('a version');
    expect(wrapper.text()).toContain('1/1');
  });

  it('only shows units with a positive number', () => {
    expect(wrapper.text()).toContain('50 - 1 a');
    expect(wrapper.text()).not.toContain('0 - 0 b');
  });

  it('only shows upgrades with a positive number', () => {
    expect(wrapper.text()).toContain('   - 1 c (+5)');
    expect(wrapper.text()).not.toContain('0 d (+10)');
  });
});
