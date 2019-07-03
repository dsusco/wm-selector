import { shallowMount } from '@vue/test-utils'

import UsedUnit from '@/components/Selector/UsedUnit';

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
          pointsCost: 50,
          upgrades: {
            'an upgrade': {}
          }
        }
      }
    }
  }
});

describe('UsedUnit.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(UsedUnit, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('.id').text()).toContain('a unit');
    expect(wrapper.find('.id').html()).toContain('upgrade-stub');
    expect(wrapper.find('.number').text()).toEqual('1');
    expect(wrapper.find('.pointsCost').text()).toEqual('50');
  });

  it('dispatches setUnitUpgradeNumber on tr click', () => {
    wrapper.find('tr').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitNumber', {
      unitID: 'a unit',
      number: 0
    });
  });
});