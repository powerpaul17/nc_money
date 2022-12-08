import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import Vue from 'vue';
import VueRouter from 'vue-router';
import { createPinia, PiniaVuePlugin } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import router from './router';

import App from './App.vue';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import.meta.glob('../node_modules/dayjs/locale/*.js', { eager: true });
dayjs.locale(l10n.getLocale().toLowerCase().replace('_', '-'));

Vue.use(VueRouter);

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.prototype.t = l10n.translate;
Vue.prototype.n = l10n.translatePlural;

new Vue({
  el: '#content',
  render: (h) => h(App),
  router,
  pinia
});

if (
  document.body.attributes.getNamedItem('data-theme-default') &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  const contentElement = document.getElementById('content-vue');
  contentElement?.setAttribute('data-theme-dark', '');
}

const settingService = useSettingService();
settingService.loadSettings();

declare module 'vue' {
  interface ComponentCustomProperties {
    t: (appName: 'money', text: string) => string
  }
}
