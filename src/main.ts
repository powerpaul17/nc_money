import Vue from 'vue';
import VueRouter from 'vue-router';
import { createPinia, PiniaVuePlugin } from 'pinia';

import './l10n';

import './css/main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import './chartjs';

import router from './router';

import App from './App.vue';

Vue.use(VueRouter);

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

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
