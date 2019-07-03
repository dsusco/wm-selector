import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import Selector from '@/views/Selector';

const localVue = createLocalVue();

var mockDispatch, store, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      label: 'a label'
    }
  }
});

localVue.use(Vuex);

describe('Selector.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        armyList: () => 'an army list',
        errors: () => ['an error'],
        pointsCost: () => 50,
        unitCount: () => 1,
        units: () => ({
          'a unit': {}
        }),
        usedUnits: () => ({
          'a unit': {}
        }),
        version: () => 'a version'
      }
    });

    wrapper = shallowMount(Selector, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('#armyList').text()).toContain('an army list');
    expect(wrapper.find('#version').text()).toEqual('a version');
    expect(wrapper.find('#pointsCost').text()).toEqual('50');
    expect(wrapper.find('#unitCount').text()).toEqual('1/1');
    expect(wrapper.find('#errors').text()).toEqual('an error');
    expect(wrapper.html()).toContain('usedunit-stub');
    expect(wrapper.html()).toContain('unit-stub');
  });

  it('dispatches setLabel when label changes', () => {
    wrapper.vm.label = 'a new label';

    expect(mockDispatch).toHaveBeenCalledWith('setLabel', 'a new label');
  });
});
