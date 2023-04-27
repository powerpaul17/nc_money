import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

import './l10n';

import './css/main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import PersonalSettings from './components/PersonalSettings.vue';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  el: '#settings-personal-money',
  render: (h) => h(PersonalSettings),
  pinia
});

const settingService = useSettingService();
void settingService.loadSettings();
