import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import PrintItems from '@/components/PrintItems';

const localVue = createLocalVue();

var mockDispatch, store, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      printItems: ['a print item']
    }
  }
});

localVue.use(Vuex);

describe('PrintItems.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
      }
    });

    wrapper = shallowMount(PrintItems, { localVue, store });
  });

  it('renders', () => {
    expect(wrapper.find('.print-items .print-item').html()).toBeDefined();
  });

  it('dispatches removePrintItem when a print item is clicked', () => {
    wrapper.find('.print-items .print-item').trigger('click');

    expect(mockDispatch).toHaveBeenCalledWith('removePrintItem', 0);
  });
});
