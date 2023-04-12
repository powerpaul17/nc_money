import { Chart, registerables } from 'chart.js';
import ChartAnnotationPlugin from 'chartjs-plugin-annotation';
import ChartDatalabelsPlugin from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartAnnotationPlugin, ChartDatalabelsPlugin);
Chart.defaults.set('plugins.legend', {
  display: false
});
Chart.defaults.set('plugins.annotation', {
  display: false
});
Chart.defaults.set('plugins.datalabels', {
  display: false
});
