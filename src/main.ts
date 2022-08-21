import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';

import './main.css';

import App from './App.vue';

import AccountsView from './views/AccountsView.vue';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/accounts/:accountId',
      component: AccountsView
    }
  ]
});
app.use(router);

app.mount('#content');
