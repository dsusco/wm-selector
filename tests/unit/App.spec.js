import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

const wrapper = shallowMount(App, {
    stubs: ['router-link', 'router-view']
  });

describe('App.vue', () => {
  it('renders enabled home tab', () => {
    expect(wrapper.find('.home-view-button').attributes('disabled')).to.be.undefined;
  });

  it('renders disabled army tabs', () => {
    expect(wrapper.find('.selector-view-button').attributes('disabled')).to.equal('true');
    expect(wrapper.find('.text-view-button').attributes('disabled')).to.equal('true');
    expect(wrapper.find('.save-view-button').attributes('disabled')).to.equal('true');
    expect(wrapper.find('.print-view-button').attributes('disabled')).to.equal('true');
  });
});
