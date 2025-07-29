<template>
  <NcAppContent
    :show-details="showDetails"
    @update:showDetails="showDetails = false"
  >
    <template #list>
      <AccountList
        :book-id="bookId"
        :account-type="accountTypeType"
        @account-item-clicked="navigateToAccount($event)"
        @account-type-item-clicked="showDetails = true"
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
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';

  import { useAccountTypeStore } from '../stores/accountTypeStore';
  import { useAccountStore, type Account } from '../stores/accountStore';

  import { useSettingStore } from '../stores/settingStore';

  import { NcAppContent } from '@nextcloud/vue';

  import AccountList from '../components/AccountList.vue';

  import Chart from '../components/dashboard/ChartComponent.vue';
  import LineChart, {
    type Data as LineChartData
  } from '../components/charts/LineChart.vue';
  import BarChart from '../components/charts/BarChart.vue';

  import { GraphDataUtils } from '../utils/graphDataUtils';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  const router = useRouter();

  const accountTypeStore = useAccountTypeStore();
  const accountStore = useAccountStore();

  const settingStore = useSettingStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountTypeType: {
      type: Number,
      required: true
    }
  });

  const showDetails = ref(true);

  const accountType = computed(() => {
    return accountTypeStore.getByType(props.accountTypeType);
  });

  const isMonthlyAccountType = computed(() => {
    return AccountTypeUtils.isMonthlyAccount(props.accountTypeType);
  });

  const isInvertedAccount = computed(() => {
    return (
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(props.accountTypeType)
    );
  });

  const lineChartData = computed((): LineChartData => {
    const inversionFactor = isInvertedAccount.value ? -1 : 1;

    const data = GraphDataUtils.createBarGraphData({
      callback: (date) => {
        return (
          accountStore.getBalanceByType({
            bookId: props.bookId,
            accountType: props.accountTypeType,
            year: date.year(),
            month: date.month() + 1
          }).value * inversionFactor
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

  const barChartData = computed(() => {
    return GraphDataUtils.createBarGraphData({
      callback: (date) => {
        const summary = accountStore.getSummaryByType({
          bookId: props.bookId,
          accountType: props.accountTypeType,
          year: date.year(),
          month: date.month() + 1
        }).value;

        return isInvertedAccount.value ? summary * -1 : summary;
      }
    });
  });

  async function navigateToAccount(account: Account): Promise<void> {
    await router.push({
      name: 'account',
      params: {
        bookId: props.bookId,
        accountId: account.id
      }
    });
  }
</script>
