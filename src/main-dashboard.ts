import { createApp } from 'vue';

import { addL10N } from './l10n';
import './chartjs';

import './css/dashboard.css';

import OverviewWidget from './components/dashboard-widgets/OverviewWidget.vue';

document.addEventListener('DOMContentLoaded', () => {
  OCA.Dashboard.register('money-overview-widget', (el) => {
    const app = createApp(OverviewWidget);
    addL10N(app);
    app.mount(el);
  });
});
