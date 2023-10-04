<template>
  <ChartJSBarChart
    class="relative h-full w-full"
    :chart-data="chartData"
    :chart-options="
      {
        responsive: true,
        maintainAspectRatio: false,
        resizeDelay: 100,
        layout: {
          padding: 30
        },
        scales: {
          x: {
            border: {
              display: false
            },
            grid: {
              display: false
            },
            ticks: {
              padding: 30
            }
          },
          y: {
            border: {
              display: false
            },
            ticks: {
              color,
              callback: (value) => {
                if(NumberUtils.areEqual(value, 0.0)) {
                  return '';
                }
                return;
              }
            }
          }
        },
        borderRadius,
        plugins: {
          tooltip: {
            enabled: false
          },
          datalabels: {
            font: {
              weight: 'bold'
            },
            labels: {
              value: {
                anchor: (context) =>
                  (context.dataset.data[context.dataIndex] ?? 0) > 0 ?
                    'end' :
                    'start',
                align: (context) =>
                  (context.dataset.data[context.dataIndex] ?? 0) > 0 ?
                    'end' :
                    'start',
                display: (context) =>
                  (context.dataset.data[context.dataIndex] ?? 0) !== 0,
                borderRadius: 4,
                padding: 6,
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
  import { Bar as ChartJSBarChart } from 'vue-chartjs';
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
  const borderRadius = Utils.getValueOfCSSVar('--border-radius-large').replace('px', '');

  const chartData = computed<TChartData<'bar'>>(() => ({
    labels: props.data.map((d) => d.label),
    datasets: [
      {
        data: props.data.map((d) => NumberUtils.roundToPrecision(d.value)),
        borderWidth: 2,
        borderColor: Utils.convertHexToRgba(color),
        backgroundColor: Utils.convertHexToRgba(color, 0.2)
      }
    ]
  }));
</script>
