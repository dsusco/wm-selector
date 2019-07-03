import { shallowMount } from '@vue/test-utils'

import UsedUpgrade from '@/components/Selector/UsedUpgrade';

const
  propsData = {
    unitID: 'a unit',
    upgradeID: 'an upgrade'
  };

var mockDispatch, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      units: {
        'a unit': {
          upgrades: {
            'an upgrade': {
              number: 1,
              pointsCost: 10
            }
          }
        }
      },
      upgrades: {
        'an upgrade': {
          minMax: '0–1',
          points: '+10'
        }
      }
    }
  }
});

describe('UsedUpgrade.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(UsedUpgrade, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('.id').text()).toEqual('an upgrade');
    expect(wrapper.find('.number').text()).toEqual('(1)');
    expect(wrapper.find('.pointsCost').text()).toEqual('(10)');
  });

  it('dispatches setUnitUpgradeNumber on tr click', () => {
    wrapper.find('tr').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
      unitID: 'a unit',
      upgradeID: 'an upgrade',
      number: 0
    });
  });
});