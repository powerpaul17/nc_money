import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import Router from './router';

import App from './App.vue';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import.meta.glob('../node_modules/dayjs/locale/*.js', { eager: true });
dayjs.locale(l10n.getLocale().toLowerCase().replace('_', '-'));

if (
  window.matchMedia('(prefers-color-scheme: dark)').matches &&
  !document.body.classList.contains('theme--light')
) {
  const contentElement = document.getElementById('content');
  contentElement?.classList.add('theme--dark');
}

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const settingService = useSettingService();
settingService.loadSettings();

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
