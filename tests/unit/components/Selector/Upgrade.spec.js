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
          order: 0,
          upgrades: {
            'an upgrade': {
              number: 1
            }
          }
        },
        'another unit': {
          order: 1,
          upgrades: {
            'another upgrade': {
              number: 1
            }
          }
        }
      },
      upgrades: {
        'an upgrade': {
          minMax: '0–1',
          points: '+10'
        },
        'another upgrade': {
          points: {
            '1': '+5'
          },
          pointsValue: 'order'
        }
      }
    }
  }
});

describe('Upgrade.vue', () => {
  describe('with standard upgrade', () => {
    beforeEach(() => {
      wrapper = shallowMount(Upgrade, { propsData: { upgradeID: 'an upgrade', unitID: 'a unit' } });
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

  describe('with a variable cost upgrade', () => {
    beforeEach(() => {
      wrapper = shallowMount(Upgrade, { propsData: { upgradeID: 'another upgrade', unitID: 'another unit' } });
    });

    it('renders', () => {
      expect(wrapper.find('.id').text()).toEqual('another upgrade');
      expect(wrapper.find('.points').text()).toEqual('+5');
    });
  });
});
