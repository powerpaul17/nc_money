import VueRouter from 'vue-router';

import AccountView from './views/AccountView.vue';
import BookView from './views/BookView.vue';
import AccountTypeView from './views/AccountTypeView.vue';
import Sidebar from './components/SidebarComponent.vue';

export default new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'dashboard'
      // component: DashboardView
    },
    {
      path: '/account/:accountId',
      components: {
        default: AccountView,
        sidebar: Sidebar
      },
      props: {
        default: (route): { accountId: number } => {
          return {
            accountId: Number(route.params.accountId)
          };
        }
      }
    },
    {
      path: '/accountType/:accountTypeType',
      name: 'account-type-view',
      component: AccountTypeView,
      props: (route): { accountTypeType: number } => ({
        accountTypeType: Number(route.params.accountTypeType)
      })
    }
  ]
});

declare module 'vue-router' {
  interface RouteMeta {
    showSidebar: boolean;
  }
}
