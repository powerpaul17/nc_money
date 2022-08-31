import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';

import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import l10n from '@nextcloud/l10n';

import './main.css';

import App from './App.vue';

import AccountsView from './views/AccountsView.vue';

dayjs.extend(customParseFormat);

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

const i18n = createI18n({
  locale: l10n.getLanguage(),
  fallbackLocale: 'en',
  messages
});
app.use(i18n);

app.mount('#content');
