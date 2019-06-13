import Vue from 'vue';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import '@/scss/wm-selector.scss';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#wm-selector');
