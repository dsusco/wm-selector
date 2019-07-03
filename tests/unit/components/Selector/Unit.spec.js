import { shallowMount } from '@vue/test-utils'

import Unit from '@/components/Selector/Unit';

const
  propsData = {
    unitID: 'a unit'
  };

var mockDispatch, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      units: {
        'a unit': {
          number: 1,
          minMax: '2/-',
          points: 50
        }
      }
    }
  }
});

describe('Unit.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Unit, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('.id').text()).toEqual('a unit');
    expect(wrapper.find('.minMax').text()).toEqual('2/-');
    expect(wrapper.find('.points').text()).toEqual('50');
  });

  it('dispatches setUnitUnitNumber on tr click', () => {
    wrapper.find('tr').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitNumber', {
      unitID: 'a unit',
      number: 2
    });
  });
});