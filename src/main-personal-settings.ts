import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import PersonalSettings from './components/PersonalSettings.vue';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

Vue.prototype.t = l10n.translate;
Vue.prototype.n = l10n.translatePlural;

new Vue({
  el: '#settings-personal-money',
  render: (h) => h(PersonalSettings),
  pinia
});

const settingService = useSettingService();
settingService.loadSettings();
