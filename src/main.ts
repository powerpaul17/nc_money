import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import l10n from '@nextcloud/l10n';

import './main.css';

import Router from './router';

import App from './App.vue';

dayjs.extend(customParseFormat);

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(Router);

const i18n = createI18n({
  locale: l10n.getLanguage(),
  fallbackLocale: 'en',
  messages,
  legacy: false
});

app.use(i18n);

app.mount('#content');
