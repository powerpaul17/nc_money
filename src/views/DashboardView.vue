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

  import { ArrayUtils } from '../utils/arrayUtils';

  const accountStore = useAccountStore();

  const equityLineChartData = computed((): LineChartData => {
    let equity =
      accountStore.assetsBalance +
      accountStore.liabilitiesBalance;

    const currentDate = dayjs();

    const labels: Array<string> = [];

    const data = ArrayUtils.createNumberArray(12)
      .map((num) => {
        const date = currentDate.subtract(num, 'months');

        equity -= (
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
        );

        labels.push(date.subtract(1, 'month').format('MMM'));

        return equity;
      })
      .reverse();

    labels.reverse();
    labels.push(currentDate.format('MMM'))

    data.push(accountStore.assetsBalance + accountStore.liabilitiesBalance);

    return {
      labels,
      datasets: [
        {
          values: data
        }
      ]
    };
  });

  const assetsLiabilitiesLineChartData = computed((): LineChartData => {
    let assets = accountStore.assetsBalance;
    let liabilities = accountStore.liabilitiesBalance;

    const currentDate = dayjs();

    const labels = [];

    const assetsData = [];
    const liabilitiesData = [];

    for (let num = 0; num < 12; num++) {
      const date = currentDate.subtract(num, 'months');

      assets -= accountStore.getSummaryByType(
        AccountTypeType.ASSET,
        date.year(),
        date.month() + 1
      );
      assetsData.push(assets);

      liabilities -= accountStore.getSummaryByType(
        AccountTypeType.LIABILITY,
        date.year(),
        date.month() + 1
      );
      liabilitiesData.push(liabilities);

      labels.push(date.subtract(1, 'month').format('MMM'));
    }

    labels.reverse();

    assetsData.reverse();
    liabilitiesData.reverse();

    labels.push(currentDate.format('MMM'));

    assetsData.push(accountStore.assetsBalance);
    liabilitiesData.push(accountStore.liabilitiesBalance);

    return {
      labels,
      datasets: [
        {
          values: assetsData,
          color: colors.lime[500],
        },
        {
          values: liabilitiesData,
          color: colors.orange[500],
        }
      ]
    };
  });

</script>
