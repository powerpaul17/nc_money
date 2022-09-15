import { createRouter, createWebHashHistory } from 'vue-router';

import AccountsView from './views/AccountsView.vue';
import Sidebar from './components/Sidebar.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/accounts/:accountId',
      components: {
        default: AccountsView,
        sidebar: Sidebar
      },
      props: {
        default: (route) => {
          return {
            accountId: Number(route.params.accountId)
          };
        }
      }
    }
  ]
});

declare module 'vue-router' {
  interface RouteMeta {
    showSidebar: boolean;
  }
}
