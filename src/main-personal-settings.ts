import { createApp } from 'vue';

import './l10n';

import './css/main.css';

import '@nextcloud/dialogs/styles/toast.scss';

import PersonalSettings from './components/PersonalSettings.vue';

const app = createApp(PersonalSettings);
app.mount('#settings-personal-money');
