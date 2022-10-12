import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import Router from './router';

import App from './App.vue';

dayjs.extend(customParseFormat);

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(Router);

app.use((app, options) => {
  app.config.globalProperties.t = l10n.translate;
  app.config.globalProperties.n = l10n.translatePlural;
});

app.mount('#content');

declare module 'vue' {
  interface ComponentCustomProperties {
    t: (appName: 'money', text: string) => string
  }
}
