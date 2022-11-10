import { createApp } from 'vue';
import { createPinia } from 'pinia';

import l10n from '@nextcloud/l10n';

import './main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import { useSettingService } from './services/settingService';

import PersonalSettings from './components/PersonalSettings.vue';

const app = createApp(PersonalSettings);

const pinia = createPinia();
app.use(pinia);

const settingService = useSettingService();
settingService.loadSettings();

app.use((app, options) => {
  app.config.globalProperties.t = l10n.translate;
  app.config.globalProperties.n = l10n.translatePlural;
});

app.mount('#app-content');
