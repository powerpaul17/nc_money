import { createRouter, createWebHashHistory } from 'vue-router';

import AccountView from './views/AccountView.vue';
import BookView from './views/BookView.vue';
import AccountTypeView from './views/AccountTypeView.vue';
import DashboardView from './views/DashboardView.vue';
import Sidebar from './components/sidebar/SidebarComponent.vue';
import TransactionSidebar from './components/sidebar/TransactionSidebar.vue';
import NewTransactionSidebar from './components/sidebar/NewTransactionSidebar.vue';

export default createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/book/:bookId',
      name: 'book',
      components: {
        default: BookView
      },
      props: {
        default: (route): { bookId: number } => ({
          bookId: Number(route.params.bookId)
        })
      }
    },
    {
      path: '/book/:bookId/account/:accountId',
      name: 'account',
      components: {
        default: AccountView,
        sidebar: Sidebar
      },
      props: {
        default: (route): { bookId: number; accountId: number } => {
          return {
            bookId: Number(route.params.bookId),
            accountId: Number(route.params.accountId)
          };
        }
      },
      children: [
        {
          path: 'transaction/:transactionId/details',
          name: 'transaction-details',
          meta: {
            showSidebar: true
          },
          components: {
            sidebar: TransactionSidebar
          },
          props: {
            sidebar: (
              route
            ): {
              bookId: number;
              transactionId: number;
              accountId?: number;
            } => {
              return {
                bookId: Number(route.params.bookId),
                transactionId: Number(route.params.transactionId),
                accountId: Number(route.params.accountId)
              };
            }
          }
        },
        {
          path: 'transaction/new-transaction',
          name: 'new-transaction',
          meta: {
            showSidebar: true
          },
          components: {
            sidebar: NewTransactionSidebar
          },
          props: {
            sidebar: (
              route
            ): {
              bookId: number;
              accountId: number;
            } => {
              return {
                bookId: Number(route.params.bookId),
                accountId: Number(route.params.accountId)
              };
            }
          }
        }
      ]
    },
    {
      path: '/book/:bookId/accountType/:accountTypeType',
      name: 'account-type',
      component: AccountTypeView,
      props: (route): { bookId: number; accountTypeType: number } => ({
        bookId: Number(route.params.bookId),
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
