<template>
  <div class="m-8">
    <Chart :title="t('money', 'Equity')">
      <LineChart :data="equityLineChartData" />
    </Chart>

    <Chart :title="`${t('money', 'Assets')}/${t('money', 'Liabilities')}`">
      <LineChart :data="assetsLiabilitiesLineChartData" />
    </Chart>
  </div>
</template>

<script setup lang="ts">

  import dayjs from 'dayjs';
  import colors from 'tailwindcss/colors';

  import { computed } from 'vue';

  import { useAccountStore } from '../stores/accountStore';
  import { AccountTypeType } from '../stores/accountTypeStore';

  import LineChart, { type Data as LineChartData } from '../components/charts/LineChart.vue';

  import Chart from '../components/dashboard/Chart.vue';

  import { GraphDataUtils } from '../utils/graphDataUtils';

  const accountStore = useAccountStore();

  const equityLineChartData = computed((): LineChartData => {
    const currentDate = dayjs();

    const data = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.assetsBalance + accountStore.liabilitiesBalance
      },
      numberOfPoints: 12,
      callback: (num, value) => {
        const date = currentDate.subtract(num, 'months');

        return {
          label: date.subtract(1, 'month').format('MMM'),
          value: value - (
            accountStore.getSummaryByType(
              AccountTypeType.ASSET,
              date.year(),
              date.month() + 1
            ) +
            accountStore.getSummaryByType(
              AccountTypeType.LIABILITY,
              date.year(),
              date.month() + 1
            )
          )
        }
      }
    });

    return {
      labels: data.map(d => d.label),
      datasets: [
        {
          values: data.map(d => d.value)
        }
      ]
    };
  });

  const assetsLiabilitiesLineChartData = computed((): LineChartData => {
    const currentDate = dayjs();

    const assetsData = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.assetsBalance
      },
      numberOfPoints: 12,
      callback: (num, value) => {
        const date = currentDate.subtract(num, 'months');

        return {
          label: date.subtract(1, 'month').format('MMM'),
          value: value - accountStore.getSummaryByType(
            AccountTypeType.ASSET,
            date.year(),
            date.month() + 1
          )
        }
      }
    });

    const liabilitiesData = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.liabilitiesBalance
      },
      numberOfPoints: 12,
      callback: (num, value) => {
        const date = currentDate.subtract(num, 'months');

        return {
          label: date.subtract(1, 'month').format('MMM'),
          value: value - accountStore.getSummaryByType(
            AccountTypeType.LIABILITY,
            date.year(),
            date.month() + 1
          )
        }
      }
    });

    return {
      labels: assetsData.map(d => d.label),
      datasets: [
        {
          values: assetsData.map(d => d.value),
          color: colors.lime[500],
        },
        {
          values: liabilitiesData.map(d => d.value),
          color: colors.orange[500],
        }
      ]
    };
  });

</script>
