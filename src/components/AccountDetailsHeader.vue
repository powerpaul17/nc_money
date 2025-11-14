<template>
  <div
    class="transition-shadow"
    :class="{
      'shadow-md': showShadow
    }"
  >
    <div class="flex items-center p-5">
      <div class="flex flex-auto flex-col">
        <div>
          <SeamlessInput
            class="text-lg"
            :placeholder="t('money', 'Name')"
            :value="account.name"
            @value-changed="handleAccountNameModified"
          />
        </div>
        <div>
          <SeamlessInput
            :placeholder="t('money', 'Description')"
            :value="account.description"
            @value-changed="handleAccountDescriptionModified"
          />
        </div>
      </div>
      <div class="flex shrink-0 grow-0 items-center text-xl">
        <AccountCurrencyText
          :value="balance"
          :account-type="account.type"
          :second-line="account.currency"
        >
        </AccountCurrencyText>
      </div>
      <div class="flex grow-0">
        <NcActions>
          <NcActionButton @click="() => (showImportTransactionsDialog = true)">
            <template #icon>
              <NcIconSvgWrapper
                :path="mdiUpload"
                :size="20"
              />
            </template>
            {{ t('money', 'Import transactions') }}
          </NcActionButton>

          <NcActionButton @click="handleOpenSidebar()">
            <template #icon>
              <NcIconSvgWrapper
                :path="mdiMenuOpen"
                :size="20"
              />
            </template>
            {{ t('money', 'Account details') }}
          </NcActionButton>

          <NcActionInput
            v-model="currency"
            :label="t('money', 'Currency')"
            @submit="handleAccountCurrencyModified"
          >
            <template #icon>
              <NcIconSvgWrapper
                :path="mdiCashMultiple"
                :size="20"
              />
            </template>
            {{ t('money', 'Currency') }}...
          </NcActionInput>
        </NcActions>

        <div class="ml-2 md:hidden">
          <NcButton
            variant="primary"
            :to="{ name: 'new-transaction' }"
          >
            <template #icon>
              <NcIconSvgWrapper
                :path="mdiPlus"
                :size="20"
              />
            </template>
          </NcButton>
        </div>
      </div>
    </div>

    <div class="hidden max-h-[25vh] md:block md:h-80">
      <LineChart
        v-if="!isMonthlyAccount"
        :data="lineChartData"
      />

      <BarChart
        v-else
        :data="barChartData"
      />
    </div>

    <TransactionImportDialog
      v-if="showImportTransactionsDialog"
      @close="() => (showImportTransactionsDialog = false)"
      :account-id="account.id"
    />
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { ref, type PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { translate as t } from '@nextcloud/l10n';

  import { GraphDataUtils } from '../utils/graphDataUtils';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { type Account, useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import {
    IncomeExpenseAccountsValueFormat,
    useSettingStore
  } from '../stores/settingStore';

  import SeamlessInput from './SeamlessInput.vue';
  import AccountCurrencyText from './AccountCurrencyText.vue';
  import TransactionImportDialog from './TransactionImportDialog.vue';
  import LineChart, { type Data } from './charts/LineChart.vue';
  import BarChart, { type DataItem } from './charts/BarChart.vue';

  import {
    NcActions,
    NcActionButton,
    NcActionInput,
    NcButton,
    NcIconSvgWrapper
  } from '@nextcloud/vue';

  import { mdiUpload, mdiPlus, mdiCashMultiple, mdiMenuOpen } from '@mdi/js';

  const router = useRouter();

  const accountStore = useAccountStore();
  const accountService = useAccountService();
  const settingStore = useSettingStore();

  const props = defineProps({
    account: {
      type: Object as PropType<Account>,
      required: true
    },
    showShadow: {
      type: Boolean,
      default: false
    }
  });

  const showImportTransactionsDialog = ref(false);
  const currency = ref(props.account.currency);

  const balance = computed(() => {
    const year =
      settingStore.incomeExpenseAccountsValueFormat.value ===
      IncomeExpenseAccountsValueFormat.YEARLY
        ? dayjs().year()
        : undefined;

    if (isMonthlyAccount.value) {
      return accountStore.getValue({ accountId: props.account.id, year });
    } else {
      return accountStore.getBalance({ accountId: props.account.id, year });
    }
  });

  const isMonthlyAccount = computed(() => {
    return AccountTypeUtils.isMonthlyAccount(props.account.type);
  });

  const isInvertedAccount = computed(() => {
    return (
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(props.account.type)
    );
  });

  const lineChartData = computed((): Data => {
    const inversionFactor = isInvertedAccount.value ? -1 : 1;

    const data = GraphDataUtils.createBarGraphData({
      callback: (date) => {
        return (
          accountStore.getBalance({
            accountId: props.account.id,
            year: date.year(),
            month: date.month() + 1
          }) * inversionFactor
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

  const barChartData = computed((): Array<DataItem> => {
    return GraphDataUtils.createBarGraphData({
      callback: (date) => {
        const summary = accountStore.getSummary({
          accountId: props.account.id,
          year: date.year(),
          month: date.month() + 1
        });

        return isInvertedAccount.value ? summary * -1 : summary;
      }
    });
  });

  async function handleAccountNameModified(name: string): Promise<void> {
    await handleAccountModified({
      ...props.account,
      name
    });
  }

  async function handleAccountDescriptionModified(
    description: string
  ): Promise<void> {
    await handleAccountModified({
      ...props.account,
      description
    });
  }

  async function handleAccountCurrencyModified(): Promise<void> {
    const newCurrency = (currency.value = currency.value.toUpperCase());

    await handleAccountModified({
      ...props.account,
      currency: newCurrency
    });
  }

  async function handleAccountModified(account: Account): Promise<void> {
    await accountService.updateAccount(account);
  }

  async function handleOpenSidebar(): Promise<void> {
    await router.push({
      name: 'account-details',
      params: {
        accountId: props.account.id.toString()
      }
    });
  }
</script>
