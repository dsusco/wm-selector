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
        units: () => ({}),
        version: () => 'a version'
      }
    });

    wrapper = shallowMount(Selector, { localVue, store });
  });

  it('renders', () => {
  });
});
