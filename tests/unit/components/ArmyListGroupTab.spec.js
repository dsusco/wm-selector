import { shallowMount } from '@vue/test-utils'

import ArmyListGroupTab from '@/components/ArmyListGroupTab';

const
  propsData = {
    group: 'a group'
  };

var mockDispatch, wrapper;

jest.mock('@/json/army-lists.json', () => ({
  'a group': {
    'a list': 'a jsonPath'
  }
}));

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: { jsonPath: 'a jsonPath' }
  }
});

describe('ArmyListGroupTab.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(ArmyListGroupTab, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('#a_group_tab_toggle_button').text()).toEqual(propsData.group);
    expect(wrapper.find('button.selected').text()).toEqual('a list');
  });

  it('dispatches setActiveArmyListGroupTab on tab button click', () => {
    wrapper.find('#a_group_tab_toggle_button').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setActiveArmyListGroupTab', 'a group');
  });

  it('dispatches setArmy on army button click', () => {
    wrapper.find('button.selected').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setArmy', 'a jsonPath');
  });
});
