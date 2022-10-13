import { createRouter, createWebHashHistory } from 'vue-router';

import AccountView from './views/AccountView.vue';
import Sidebar from './components/Sidebar.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/accounts/:accountId',
      components: {
        default: AccountView,
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
