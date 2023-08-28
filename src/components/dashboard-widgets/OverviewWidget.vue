<template>
  <div>
    <LineChart
      :data="equityChartData"
      :title="t('money', 'Equity')"
    />
    <LineChart
      :data="assetsChartData"
      :title="t('money', 'Assets')"
    />
    <LineChart
      :data="liabilitiesChartData"
      :title="t('money', 'Liabilities')"
    />
  </div>
</template>

<script setup lang="ts">

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
    void accountService.fetchAccounts();
  });

  const equityChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createLineGraphData({
      startValue: accountStore.assetsBalance.value + accountStore.liabilitiesBalance.value,
      numberOfMonths: 6,
      callback: (date) => {
        return (
          accountStore.getSummaryByType(
            AccountTypeType.ASSET,
            date.year(),
            date.month() + 1
          ).value +
          accountStore.getSummaryByType(
            AccountTypeType.LIABILITY,
            date.year(),
            date.month() + 1
          ).value
        );
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

  const assetsChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createLineGraphData({
      startValue: accountStore.assetsBalance.value,
      numberOfMonths: 6,
      callback: (date) => {
        return accountStore.getSummaryByType(
          AccountTypeType.ASSET,
          date.year(),
          date.month() + 1
        ).value;
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
    const data = GraphDataUtils.createLineGraphData({
      startValue: accountStore.liabilitiesBalance.value,
      numberOfMonths: 6,
      callback: (date) => {
        return accountStore.getSummaryByType(
          AccountTypeType.LIABILITY,
          date.year(),
          date.month() + 1
        ).value;
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
