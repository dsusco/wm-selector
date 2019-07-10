import Querystring from 'querystring';

import store from '@/store';

function checkJSONPathBeforeEnter (to, from, next) {
  if (store.getters.jsonPath === '') {
    next({ name: 'Home' });
  } else {
    next();
  }
}

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
    beforeEnter (to, from, next) {
      var params = Querystring.parse(to.fullPath.replace(/^\/\?/, ''));

      if (window.location.pathname === '/army_selector.html') {
        next(false)

        window.location.replace(
          window.location.href
            .replace('army_selector.html', '#/')
            .replace(/#\/$/, '')
        );
      } else if (params.jsonPath || params.list) {
        store.dispatch('loadSaveURL', params);
      } else {
        next();
      }
    }
  },
  {
    path: '/selector',
    name: 'Selector',
    component: () => import('@/views/Selector'),
    beforeEnter: checkJSONPathBeforeEnter
  },
  {
    path: '/mobile-selector',
    name: 'Mobile Selector',
    component: () => import('@/views/MobileSelector'),
    beforeEnter: checkJSONPathBeforeEnter
  },
  {
    path: '/text',
    name: 'Text',
    component: () => import('@/views/Text'),
    beforeEnter: checkJSONPathBeforeEnter
  },
  {
    path: '/save',
    name: 'Save',
    component: () => import('@/views/Save'),
    beforeEnter: checkJSONPathBeforeEnter
  },
  {
    path: '/print',
    name: 'Print',
    component: () => import('@/views/Print'),
    beforeEnter: checkJSONPathBeforeEnter
  }
];
