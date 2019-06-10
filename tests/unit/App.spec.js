import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

import App from '@/App.vue';

const
  localVue = createLocalVue(),
  stubs = ['router-link', 'router-view'];

var store, wrapper;

localVue.use(Vuex);

describe('App.vue', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      getters: { jsonPath: () => '' }
    });

    wrapper = shallowMount(App, { localVue, store, stubs });
  });

  it('renders enabled home tab with no jsonPath', () => {
    expect(wrapper.find('.home-view-button').attributes('disabled')).toBeUndefined;
  });

  it('renders disabled army tabs with no jsonPath', () => {
    expect(wrapper.find('.selector-view-button').attributes('disabled')).toEqual('true');
    expect(wrapper.find('.text-view-button').attributes('disabled')).toEqual('true');
    expect(wrapper.find('.save-view-button').attributes('disabled')).toEqual('true');
    expect(wrapper.find('.print-view-button').attributes('disabled')).toEqual('true');
  });

  it('renders enabled army tabs with a jsonPath', () => {
    store.getters = { jsonPath: () => 'NOT EMPTY!' };
    wrapper = shallowMount(App, { localVue, store, stubs });

    expect(wrapper.find('.selector-view-button').attributes('disabled')).toBeUndefined;
    expect(wrapper.find('.text-view-button').attributes('disabled')).toBeUndefined;
    expect(wrapper.find('.save-view-button').attributes('disabled')).toBeUndefined;
    expect(wrapper.find('.print-view-button').attributes('disabled')).toBeUndefined;
  });
});
