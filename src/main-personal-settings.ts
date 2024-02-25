import { createApp } from 'vue';

import { addL10N } from './l10n';

import './css/main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import PersonalSettings from './components/PersonalSettings.vue';

const app = createApp(PersonalSettings);
addL10N(app);
app.mount('#settings-personal-money');

const settingService = useSettingService();
void settingService.loadSettings();
