import { shallowMount } from '@vue/test-utils'

import Upgrade from '@/components/Selector/Upgrade';

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
              number: 1
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

describe('Upgrade.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Upgrade, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('.id').text()).toEqual('an upgrade');
    expect(wrapper.find('.minMax').text()).toEqual('0–1');
    expect(wrapper.find('.points').text()).toEqual('+10');
  });

  it('dispatches setUpgradeUpgradeNumber on tr click', () => {
    wrapper.find('tr').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
      unitID: 'a unit',
      upgradeID: 'an upgrade',
      number: 2
    });
  });
});