import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import MobileSelector from '@/views/MobileSelector';

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

describe('MobileSelector.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        armyList: () => 'an army list',
        errors: () => ['an error'],
        pointsCost: () => 50,
        unitCount: () => 1,
        units: () => ({}),
        version: () => 'a version'
      }
    });

    wrapper = shallowMount(MobileSelector, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('.armyList').text()).toContain('an army list');
    expect(wrapper.find('.version').text()).toEqual('a version');
    expect(wrapper.find('.pointsCost').text()).toEqual('50 points');
    expect(wrapper.find('.unitCount').text()).toEqual('1/1');
    expect(wrapper.find('.errors').text()).toEqual('an error');
  });

  it('toggles errorsHidden on .errors-toggle-button click', () => {
    expect(wrapper.vm.errorsHidden).toBeTruthy();
    wrapper.find('.errors-toggle-button').trigger('click');
    expect(wrapper.vm.errorsHidden).toBeFalsy();
  });

  it('dispatches setLabel when label changes', () => {
    wrapper.vm.label = 'a new label';

    expect(mockDispatch).toHaveBeenCalledWith('setLabel', 'a new label');
  });
});
