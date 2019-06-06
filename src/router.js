import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/selector',
      name: 'Selector',
      component: () => import('./views/Selector.vue')
    },
    {
      path: '/text',
      name: 'Text',
      component: () => import('./views/Text.vue')
    },
    {
      path: '/save',
      name: 'Save',
      component: () => import('./views/Save.vue')
    },
    {
      path: '/print',
      name: 'Print',
      component: () => import('./views/Print.vue')
    }
  ]
});
