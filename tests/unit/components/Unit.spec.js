import { shallowMount } from '@vue/test-utils'

import Unit from '@/components/Unit';

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
          points: 50,
          upgrades: {
            'an upgrade': {
              number: 1
            }
          }
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
    expect(wrapper.find('.unit').attributes('id')).toEqual('a_unit_unit');
    expect(wrapper.find('.id').text()).toEqual('a unit (50)');
    expect(wrapper.find('.number').text()).toEqual('1');
    expect(wrapper.find('.upgrades').attributes('hidden')).toBeTruthy();
  });

  it('sets upgradesHidden to true when remove reduces number to 0', () => {
    wrapper.find('.upgrades-toggle-button').trigger('click');
    wrapper.find('.remove-button').trigger('click');
    expect(wrapper.vm.upgradesHidden).toBeTruthy();
  });

  it('dispatches setUnitUnitNumber on .remove-button click', () => {
    wrapper.find('.remove-button').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitNumber', {
      unitID: 'a unit',
      number: 0
    });
  });

  it('dispatches setUnitUnitNumber on .add-button click', () => {
    wrapper.find('.add-button').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setUnitNumber', {
      unitID: 'a unit',
      number: 2
    });
  });

  it('toggles upgradesHidden on .upgrades-toggle-button click', () => {
    expect(wrapper.vm.upgradesHidden).toBeTruthy();
    wrapper.find('.upgrades-toggle-button').trigger('click');
    expect(wrapper.vm.upgradesHidden).toBeFalsy();
  });
});