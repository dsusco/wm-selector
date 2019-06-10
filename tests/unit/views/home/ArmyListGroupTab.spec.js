import { shallowMount, createLocalVue } from '@vue/test-utils'

import ArmyListGroupTab from '@/views/home/ArmyListGroupTab.vue';

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
    expect(wrapper.find('.army-list-group-tab h2').text()).toEqual(propsData.group);
    expect(wrapper.find('label').text()).toEqual('a list');
    expect(wrapper.find('input').attributes('value')).toEqual('a jsonPath');
  });

  it('dispatches setArmy on input change', () => {
    wrapper.find('input').trigger('change');
    expect(mockDispatch).toHaveBeenCalledWith('setArmy', 'a jsonPath');
  });
});
