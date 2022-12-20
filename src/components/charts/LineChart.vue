<template>
  <ChartJSLineChart
    class="relative h-full w-full"
    :chart-data="chartData"
    :chart-options="
      {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        pointHoverRadius: 6,
        layout: {
          padding: 30
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false
            }
          },
          y: {
            display: false
          }
        },
        plugins: {
          tooltip: {
            enabled: false
          },
          datalabels: {
            display: true,
            color: (context) => context.dataset.backgroundColor,
            font: {
              weight: 'bold'
            },
            labels: {
              value: {
                anchor: 'end',
                align: 'end',
                formatter: (value) => NumberUtils.formatNumber(value, {})
              }
            }
          }
        }
      }
    "
  />
</template>

<script setup lang="ts">
  import colors from 'tailwindcss/colors';

  import { Line as ChartJSLineChart } from 'vue-chartjs';
  import type { TChartData } from 'vue-chartjs/dist/types';

  import { computed, type PropType } from 'vue';

  import { Utils } from '../../utils/utils';
  import { NumberUtils } from '../../utils/numberUtils';

  export type DataItem = {
    label: string;
    value: number;
  };

  const props = defineProps({
    data: {
      type: Array as PropType<Array<DataItem>>,
      required: true
    }
  });

  const color = Utils.getValueOfCSSVar('--color-primary-element');

  const chartData = computed<TChartData<'line'>>(() => ({
    labels: props.data.map((d) => d.label),
    datasets: [
      {
        data: props.data.map((d) => d.value),
        borderColor: 'transparent',
        backgroundColor: color,
        cubicInterpolationMode: 'monotone',
        fill: {
          target: 'origin',
          above: Utils.convertHexToRgba(color, 0.2),
          below: Utils.convertHexToRgba(colors.red[300], 0.2)
        }
      }
    ]
  }));
</script>
