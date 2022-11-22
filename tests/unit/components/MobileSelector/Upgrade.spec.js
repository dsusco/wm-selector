import { shallowMount } from '@vue/test-utils'

import Upgrade from '@/components/MobileSelector/Upgrade';

var mockDispatch, wrapper;

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: {
      units: {
        'a unit': {
          order: 0,
          number: 2,
          upgrades: {
            'an upgrade': {
              number: 1
            }
          }
        },
        'another unit': {
          order: 0,
          number: 2,
          upgrades: {
            'another upgrade': {
              number: 1
            }
          }
        }
      },
      upgrades: {
        'an upgrade': {
          points: '+5'
        },
        'another upgrade': {
          points: {
            '0': '+10'
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
      expect(wrapper.find('.upgrade').attributes('id')).toEqual('a_unit_unit_an_upgrade_upgrade');
      expect(wrapper.find('.id').text()).toEqual('an upgrade (+5)');
      expect(wrapper.find('.number').text()).toEqual('1');
      expect(wrapper.find('.add-button').attributes('disabled')).toBeUndefined;
    });

    it('dispatches setUnitUpgradeNumber on .remove-button click', () => {
      wrapper.find('.remove-button').trigger('click');
      expect(mockDispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
        upgradeID: 'an upgrade',
        unitID: 'a unit',
        number: 0
      });
    });

    it('dispatches setUnitUpgradeNumber on .add-button click', () => {
      wrapper.find('.add-button').trigger('click');
      expect(mockDispatch).toHaveBeenCalledWith('setUnitUpgradeNumber', {
        upgradeID: 'an upgrade',
        unitID: 'a unit',
        number: 2
      });
    });
  });

  describe('with a variable cost upgrade', () => {
    beforeEach(() => {
      wrapper = shallowMount(Upgrade, { propsData: { upgradeID: 'another upgrade', unitID: 'another unit' } });
    });

    it('renders', () => {
      expect(wrapper.find('.upgrade').attributes('id')).toEqual('another_unit_unit_another_upgrade_upgrade');
      expect(wrapper.find('.id').text()).toEqual('another upgrade (+10)');
      expect(wrapper.find('.number').text()).toEqual('1');
      expect(wrapper.find('.add-button').attributes('disabled')).toBeUndefined;
    });
  });
});
