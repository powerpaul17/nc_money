<template>
  <ChartJSLineChart
    class="relative size-full"
    :data="chartData"
    :options="{
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 100,
      pointHoverRadius: 5,
      layout: {
        padding: 30
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false
        }
      },
      interaction: {
        intersect: false
      },
      plugins: {
        title: {
          display: !!props.title,
          text: props.title,
          color: textColor
        },
        tooltip: {
          enabled: false
        },
        datalabels: {
          display: (context) =>
            context.active ||
            context.dataIndex === context.dataset.data.length - 1,
          color: (context) => context.dataset.borderColor,
          font: {
            weight: 'bold'
          },
          labels: {
            key: {
              anchor: 'start',
              align: 'start',
              display: (context) => context.active,
              formatter: (value, context) =>
                context.dataset.labels[context.dataIndex]
            },
            value: {
              anchor: 'end',
              align: 'end',
              formatter: (value) =>
                NumberUtils.formatNumber(value, {
                  decimals: settingStore.numberFormat_decimals.value,
                  decimalSeparator:
                    settingStore.numberFormat_decimalSeparator.value,
                  groupBy: settingStore.numberFormat_groupBy.value,
                  groupSeparator: settingStore.numberFormat_groupSeparator.value
                })
            }
          }
        }
      }
    }"
  />
</template>

<script setup lang="ts">
  import colors from 'tailwindcss/colors';

  import { Line as ChartJSLineChart } from 'vue-chartjs';
  import type { ChartData } from 'chart.js';

  import { computed, type PropType } from 'vue';

  import { Utils } from '../../utils/utils';
  import { NumberUtils } from '../../utils/numberUtils';

  import { useSettingStore } from '../../stores/settingStore';

  export type Data = {
    labels: Array<string>;
    datasets: Array<{
      color?: string;
      values: Array<number>;
    }>;
  };

  const props = defineProps({
    data: {
      type: Object as PropType<Data>,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  });

  const settingStore = useSettingStore();

  const textColor = Utils.getValueOfCSSVar('--color-main-text');
  const backgroundColor = Utils.getValueOfCSSVar('--color-main-background');

  const chartData = computed<ChartData<'line'>>(() => ({
    labels: props.data.labels,
    datasets: props.data.datasets.map((dataset) => {
      const color =
        dataset.color ?? Utils.getValueOfCSSVar('--color-primary-element');

      return {
        data: dataset.values.map((v) => NumberUtils.roundToPrecision(v)),
        labels: props.data.labels,

        borderColor: color,
        borderWidth: 2,

        pointBackgroundColor: backgroundColor,
        pointBorderWidth: 2,

        hoverBackgroundColor: backgroundColor,
        hoverBorderWidth: 2,

        cubicInterpolationMode: 'monotone',
        fill: {
          target: 'origin',
          above: Utils.convertHexToRgba(color, 0.2),
          below: Utils.convertHexToRgba(colors.red[300], 0.2)
        }
      };
    })
  }));
</script>
