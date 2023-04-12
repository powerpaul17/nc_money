<template>
  <div>
    <LineChart :data="equityChartData" />
  </div>
</template>

<script setup lang="ts">

  import dayjs from 'dayjs';

  import { computed, onBeforeMount } from 'vue';

  import { useAccountStore } from '../../stores/accountStore';
  import { AccountTypeType } from '../../stores/accountTypeStore';

  import { useAccountService } from '../../services/accountService';

  import { ArrayUtils } from '../../utils/arrayUtils';

  import LineChart, { type Data as LineChartData } from '../charts/LineChart.vue';

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  onBeforeMount(() => {
    accountService.fetchAccounts();
  });

  const equityChartData = computed((): LineChartData => {
    let equity =
      accountStore.assetsBalance +
      accountStore.liabilitiesBalance;

    const currentDate = dayjs();

    const labels: Array<string> = [];

    const data = ArrayUtils.createNumberArray(6)
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

</script>
