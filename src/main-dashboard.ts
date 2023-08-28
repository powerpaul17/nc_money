import Vue from 'vue';

import './l10n';
import './chartjs';

import './css/dashboard.css';

import OverviewWidget from './components/dashboard-widgets/OverviewWidget.vue';

document.addEventListener('DOMContentLoaded', () => {
  OCA.Dashboard.register('money-overview-widget', (el) => {
    const View = Vue.extend(OverviewWidget);
    new View({
      propsData: {}
    }).$mount(el);
  });
});
