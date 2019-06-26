import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import Print from '@/views/Print';

const localVue = createLocalVue();

var mockDispatch, store, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      printableItems: [{ abbr: 'pi1', title: 'printable item 1' }]
    }
  }
});

localVue.use(Vuex);

describe('Print.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
      }
    });

    wrapper = shallowMount(Print, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('.printable-items').text()).toContain('printable item 1');
  });

  it('dispatches addPrintItem when a printable item is clicked', () => {
    wrapper.find('.printable-items button').trigger('click');

    expect(mockDispatch).toHaveBeenCalledWith('addPrintItem', 0);
  });
});
