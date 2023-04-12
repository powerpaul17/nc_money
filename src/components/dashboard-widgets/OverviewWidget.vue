<template>
  <div>
    <LineChart :data="equityChartData" :title="t('money', 'Equity')" />
    <LineChart :data="assetsChartData" :title="t('money', 'Assets')" />
    <LineChart :data="liabilitiesChartData" :title="t('money', 'Liabilities')" />
  </div>
</template>

<script setup lang="ts">

  import dayjs from 'dayjs';
  import colors from 'tailwindcss/colors';

  import { computed, onBeforeMount } from 'vue';

  import { useAccountStore } from '../../stores/accountStore';
  import { AccountTypeType } from '../../stores/accountTypeStore';

  import { useAccountService } from '../../services/accountService';

  import { GraphDataUtils } from '../../utils/graphDataUtils';

  import LineChart, { type Data as LineChartData } from '../charts/LineChart.vue';

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  onBeforeMount(() => {
    accountService.fetchAccounts();
  });

  const equityChartData = computed((): LineChartData => {
    const currentDate = dayjs();

    const data = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.assetsBalance + accountStore.liabilitiesBalance
      },
      numberOfPoints: 6,
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
    })

    return {
      labels: data.map(d => d.label),
      datasets: [
        {
          values: data.map(d => d.value)
        }
      ]
    };
  });

  const assetsChartData = computed((): LineChartData => {
    const currentDate = dayjs();

    const data = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.assetsBalance
      },
      numberOfPoints: 6,
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


    return {
      labels: data.map(d => d.label),
      datasets: [
        {
          color: colors.lime[500],
          values: data.map(d => d.value)
        }
      ]
    };
  });

  const liabilitiesChartData = computed((): LineChartData => {
    const currentDate = dayjs();

    const data = GraphDataUtils.createBackwardsCalculatedGraphData({
      initialValue: {
        label: currentDate.format('MMM'),
        value: accountStore.liabilitiesBalance
      },
      numberOfPoints: 6,
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
      labels: data.map(d => d.label),
      datasets: [
        {
          color: colors.orange[500],
          values: data.map(d => d.value)
        }
      ]
    };
  });

</script>
