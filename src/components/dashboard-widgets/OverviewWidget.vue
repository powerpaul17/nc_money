<template>
  <div>
    <div>
      <LineChart
        :data="equityChartData"
        :title="t('money', 'Equity')"
      />
    </div>
    <div>
      <LineChart
        :data="assetsChartData"
        :title="t('money', 'Assets')"
      />
    </div>
    <div>
      <LineChart
        :data="liabilitiesChartData"
        :title="t('money', 'Liabilities')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import colors from 'tailwindcss/colors';

  import { computed, onBeforeMount } from 'vue';

  import { useAccountStore } from '../../stores/accountStore';
  import { AccountTypeType } from '../../stores/accountTypeStore';

  import { useAccountService } from '../../services/accountService';

  import { GraphDataUtils } from '../../utils/graphDataUtils';

  import LineChart, {
    type Data as LineChartData
  } from '../charts/LineChart.vue';

  const accountStore = useAccountStore();
  const accountService = useAccountService();

  onBeforeMount(() => {
    void accountService.fetchAccounts();
  });

  const equityChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createBarGraphData({
      numberOfMonths: 6,
      callback: (date) => {
        return (
          accountStore.getBalanceByType({
            bookId,
            accountType: AccountTypeType.ASSET,
            year: date.year(),
            month: date.month() + 1
          }).value +
          accountStore.getBalanceByType({
            bookId,
            accountType: AccountTypeType.LIABILITY,
            year: date.year(),
            month: date.month() + 1
          }).value
        );
      }
    });

    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          values: data.map((d) => d.value)
        }
      ]
    };
  });

  const assetsChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createBarGraphData({
      numberOfMonths: 6,
      callback: (date) => {
        return accountStore.getBalanceByType({
          bookId,
          accountType: AccountTypeType.ASSET,
          year: date.year(),
          month: date.month() + 1
        }).value;
      }
    });

    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          color: colors.lime[500],
          values: data.map((d) => d.value)
        }
      ]
    };
  });

  const liabilitiesChartData = computed((): LineChartData => {
    const data = GraphDataUtils.createBarGraphData({
      numberOfMonths: 6,
      callback: (date) => {
        return accountStore.getBalanceByType({
          bookId,
          accountType: AccountTypeType.LIABILITY,
          year: date.year(),
          month: date.month() + 1
        }).value;
      }
    });

    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          color: colors.orange[500],
          values: data.map((d) => d.value)
        }
      ]
    };
  });
</script>
