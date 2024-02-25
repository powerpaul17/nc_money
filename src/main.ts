import { createApp } from 'vue';

import { addL10N } from './l10n';

import './css/main.css';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import '@nextcloud/dialogs/styles/toast.scss';
import 'vue-select/dist/vue-select.css';

import { useSettingService } from './services/settingService';
import { useAccountService } from './services/accountService';

import './chartjs';

import router from './router';

import App from './App.vue';
import { useBookService } from './services/bookService';

const app = createApp(App);

app.use(router);
addL10N(app);

app.mount('#content');

if (
  document.body.attributes.getNamedItem('data-theme-default') &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  const contentElement = document.getElementById('content-vue');
  contentElement?.setAttribute('data-theme-dark', '');
}

const settingService = useSettingService();
void settingService.loadSettings();

const accountService = useAccountService();
void accountService.fetchAccounts();

const bookService = useBookService();
void bookService.fetchBooks();
