import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

import './l10n';
import './chartjs';

import './css/dashboard.css';

import OverviewWidget from './components/dashboard-widgets/OverviewWidget.vue';

document.addEventListener('DOMContentLoaded', () => {
  OCA.Dashboard.register('money-overview-widget', (el) => {
    Vue.use(PiniaVuePlugin);
    const pinia = createPinia();

    const View = Vue.extend(OverviewWidget);
    new View({
      propsData: {},
      pinia
    }).$mount(el);
  });
});
