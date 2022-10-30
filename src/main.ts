import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import Router from './router';

import App from './App.vue';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import.meta.glob('../node_modules/dayjs/locale/*.js', { eager: true });
dayjs.locale(l10n.getLocale().toLowerCase().replace('_', '-'));

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
