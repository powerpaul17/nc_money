import { createRouter, createWebHashHistory } from 'vue-router';

import AccountsView from './views/AccountsView.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/accounts/:accountId',
      component: AccountsView
    }
  ]
});
