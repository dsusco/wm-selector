import { shallowMount } from '@vue/test-utils';

import StatLine from '@/components/Print/StatLine';

var wrapper;

jest.mock('@/store', () => ({
  getters: {
    specialRules: {
      Troop: { order: 1 }
    }
  }
}));

describe('StatLine.vue', () => {
  it('renders troop line', () => {
    wrapper = shallowMount(StatLine, {
      propsData: {
        name: 'Troop',
        troop: {
          pointsCost: 50,
          number: 1,
          type: 'Infantry',
          attack: 3,
          hits: 3,
          armour: '6+',
          size: 3,
          minMax: '2/-',
          points: 50
        },
      used: true }
    });

    expect(wrapper.find('.points-cost').text()).toEqual('50');
    expect(wrapper.find('.number').text()).toEqual('1');
    expect(wrapper.find('.troop').text()).toEqual('Troop');
    expect(wrapper.find('.type').text()).toEqual('Infantry');
    expect(wrapper.find('.attack').text()).toEqual('3');
    expect(wrapper.find('.range').text()).toEqual('-');
    expect(wrapper.find('.hits').text()).toEqual('3');
    expect(wrapper.find('.armour').text()).toEqual('6+');
    expect(wrapper.find('.command').text()).toEqual('-');
    expect(wrapper.find('.size').text()).toEqual('3');
    expect(wrapper.find('.points').text()).toEqual('50');
    expect(wrapper.find('.minMax').text()).toEqual('2/-');
    expect(wrapper.find('.special').text()).toEqual('*1');
  });

  it('renders upgrade line', () => {
    wrapper = shallowMount(StatLine, {
      propsData: {
        name: 'Upgrade',
        troop: {
          pointsCost: 5,
          number: 1,
          type: 'Magic Item',
          minMax: '1',
          points: '+5'
        },
      used: true,
      parent: true }
    });

    expect(wrapper.find('.points-cost').text()).toEqual('(5)');
    expect(wrapper.find('.number').text()).toEqual('1');
    expect(wrapper.find('.troop').text()).toEqual('Upgrade');
    expect(wrapper.find('.type').text()).toEqual('Magic Item');
    expect(wrapper.find('.attack').text()).toEqual('-');
    expect(wrapper.find('.range').text()).toEqual('-');
    expect(wrapper.find('.hits').text()).toEqual('-');
    expect(wrapper.find('.armour').text()).toEqual('-');
    expect(wrapper.find('.command').text()).toEqual('-');
    expect(wrapper.find('.size').text()).toEqual('-');
    expect(wrapper.find('.points').text()).toEqual('+5');
    expect(wrapper.find('.minMax').text()).toEqual('1');
    expect(wrapper.find('.special').text()).toEqual('-');
  });
});
