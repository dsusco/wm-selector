import { shallowMount } from '@vue/test-utils'

import ArmyListGroupTab from '@/views/home/ArmyListGroupTab';

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
    expect(wrapper.find('.army-list-group-tab .h3').text()).toEqual(propsData.group);
    expect(wrapper.find('button').text()).toEqual('a list');
  });

  it('dispatches setArmy on input change', () => {
    wrapper.find('button').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setArmy', 'a jsonPath');
  });
});
