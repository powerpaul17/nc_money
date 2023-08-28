<template>
  <NcAppContent
    :show-details="showDetails"
    @update:showDetails="emit('show-details-changed', false)"
  >
    <template #list>
      <AccountList
        :account-type="accountTypeType"
        @item-clicked="emit('show-details-changed', true)"
      />
    </template>

    <div class="m-8">
      <Chart :title="accountType ? accountType.name : ''">
        <LineChart
          v-if="!isMonthlyAccountType"
          :data="lineChartData"
        />
        <BarChart
          v-else
          :data="barChartData"
        />
      </Chart>
    </div>
  </NcAppContent>
</template>

<script setup lang="ts">

  import { computed } from 'vue';

  import { useAccountTypeStore } from '../stores/accountTypeStore';
  import { useAccountStore } from '../stores/accountStore';

  import { useSettingStore } from '../stores/settingStore';

  import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent';

  import AccountList from '../components/AccountList.vue';

  import Chart from '../components/dashboard/Chart.vue';
  import LineChart, { type Data as LineChartData } from '../components/charts/LineChart.vue';
  import BarChart from '../components/charts/BarChart.vue';

  import { GraphDataUtils } from '../utils/graphDataUtils';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  const accountTypeStore = useAccountTypeStore();
  const accountStore = useAccountStore();

  const settingStore = useSettingStore();

  const props = defineProps({
    accountTypeType: {
      type: Number,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits<{
    (event: 'show-details-changed', showDetails: boolean): void
  }>();

  const accountType = computed(() => {
    return accountTypeStore.getByType(props.accountTypeType);
  });

  const isMonthlyAccountType = computed(() => {
    return AccountTypeUtils.isMonthlyAccount(props.accountTypeType);
  });

  const isInvertedAccount = computed(() => {
    return settingStore.useInvertedAccounts.value && AccountTypeUtils.isInvertedAccount(props.accountTypeType);
  });

  const lineChartData = computed((): LineChartData => {
    const inversionFactor = isInvertedAccount.value ? -1 : 1;

    const data = GraphDataUtils.createLineGraphData({
      startValue: (accountType.value?.balance.value ?? 0.0) * inversionFactor,
      callback: (date) => {
        return  accountStore.getSummaryByType(
          props.accountTypeType,
          date.year(),
          date.month() + 1
        ).value * inversionFactor;
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

  const barChartData = computed(() => {
    return GraphDataUtils.createBarGraphData({
      callback: (date) => {
        const summary = accountStore.getSummaryByType(
          props.accountTypeType,
          date.year(),
          date.month() + 1
        ).value;

        return isInvertedAccount.value ? summary * -1 : summary;
      }
    });
  });

</script>
