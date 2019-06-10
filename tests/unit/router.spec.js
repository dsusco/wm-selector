import { createLocalVue, mount } from "@vue/test-utils"
import VueRouter from "vue-router"

import App from "@/App.vue"
import routes from "@/router/routes.js"

const
  localVue = createLocalVue(),
  router = new VueRouter({ routes });

var store, wrapper;

localVue.use(VueRouter);

describe('router.js', () => {
  describe('without jsonPath', () => {
    beforeEach(() => {
      store = {
        getters: {
          jsonPath: ''
        }
      };

      wrapper = mount(App, { localVue, router, store });
    });

    it('renders Home view with disabled army tabs', () => {
      router.push('/');

      expect(wrapper.find('.home-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.selector-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.text-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.save-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.print-view-button').attributes('disabled')).toEqual('disabled');
    });

    it('forces Home view', () => {
      router.push('/selector');

      expect(wrapper.find('.home-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.selector-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.text-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.save-view-button').attributes('disabled')).toEqual('disabled');
      expect(wrapper.find('.print-view-button').attributes('disabled')).toEqual('disabled');
    });
  });

  describe('with jsonPath', () => {
    beforeEach(() => {
      store = {
        getters: {
          jsonPath: 'NOT EMPTY!'
        }
      };

      wrapper = mount(App, { localVue, router, store });
    });

    it('renders Home view with enabled army tabs', () => {
      router.push('/');

      expect(wrapper.find('.home-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.selector-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.text-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.save-view-button').attributes('disabled')).toBeUndefined;
      expect(wrapper.find('.print-view-button').attributes('disabled')).toBeUndefined;
    });

    it('allows other views', () => {
      router.push('/selector');

      expect(wrapper.find('.selector-view')).toBeDefined;
    });
  });
});
