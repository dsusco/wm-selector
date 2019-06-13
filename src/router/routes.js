import store from '@/store';

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/selector',
    name: 'Selector',
    component: () => import('@/views/Selector.vue'),
    beforeEnter (to, from, next) {
      if (store.getters.jsonPath === '') {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('@/views/Text.vue'),
    beforeEnter (to, from, next) {
      if (store.getters.jsonPath === '') {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/save',
    name: 'Save',
    component: () => import('@/views/Save.vue'),
    beforeEnter (to, from, next) {
      if (store.getters.jsonPath === '') {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/print',
    name: 'Print',
    component: () => import('@/views/Print.vue'),
    beforeEnter (to, from, next) {
      if (store.getters.jsonPath === '') {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  }
];
