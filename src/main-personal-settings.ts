import Vue, { type VNode } from 'vue';

import './l10n';

import './css/main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import PersonalSettings from './components/PersonalSettings.vue';

new Vue({
  el: '#settings-personal-money',
  render: (h): VNode => h(PersonalSettings)
});

const settingService = useSettingService();
void settingService.loadSettings();
