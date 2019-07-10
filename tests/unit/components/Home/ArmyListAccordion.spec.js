import { shallowMount } from '@vue/test-utils'

import ArmyListAccordion from '@/components/Home/ArmyListAccordion';

const
  propsData = {
    title: 'a title'
  };

var mockDispatch, wrapper;

jest.mock('@/json/army-lists.json', () => ({
  'a title': [
    { name: 'a group name', lists: [ { name: 'a list name', path: 'a jsonPath' } ] }
  ]
}));

jest.mock('@/store', () => {
  mockDispatch = jest.fn();

  return {
    dispatch: mockDispatch,
    getters: { jsonPath: 'a jsonPath' }
  }
});

describe('ArmyListAccordion.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(ArmyListAccordion, { propsData });
  });

  it('renders', () => {
    expect(wrapper.find('#a_title_accordion_toggle_button').text()).toEqual(propsData.title);
    expect(wrapper.find('.h5').text()).toEqual('a group name');
    expect(wrapper.find('button.selected').text()).toEqual('a list name');
  });

  it('dispatches setActiveArmyListAccordion on tab button click', () => {
    wrapper.find('#a_title_accordion_toggle_button').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setActiveArmyListAccordion', 'a title');
  });

  it('dispatches setArmy on army button click', () => {
    wrapper.find('button.selected').trigger('click');
    expect(mockDispatch).toHaveBeenCalledWith('setArmy', 'a jsonPath');
  });
});
