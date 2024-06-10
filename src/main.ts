import { createApp } from 'vue';

import './l10n';

import './css/main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@nextcloud/dialogs/styles/toast.scss';
import 'vue-select/dist/vue-select.css';

import './chartjs';

import router from './router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#content');

if (
  document.body.attributes.getNamedItem('data-theme-default') &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  const contentElement = document.getElementById('content-vue');
  contentElement?.setAttribute('data-theme-dark', '');
}
