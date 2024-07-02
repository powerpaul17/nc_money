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
      <div class="flex shrink-0 grow-0 items-center text-right text-xl">
        <CurrencyText
          :value="balance"
          :animation="true"
          :inverted-value="isInvertedAccount"
        >
          <template
            #suffix
            v-if="isMonthlyAccount"
          >
            / {{ t('money', 'mo') }}
          </template>
        </CurrencyText>
      </div>
      <div class="flex grow-0">
        <NcActions>
          <NcActionButton @click="() => (showImportTransactionsDialog = true)">
            <template #icon>
              <Upload :size="20" />
            </template>
            {{ t('money', 'Import transactions') }}
          </NcActionButton>
        </NcActions>

        <NcButton
          class="ml-2 md:hidden"
          type="primary"
          :to="{ name: 'new-transaction' }"
        >
          <template #icon>
            <Plus :size="20" />
          </template>
        </NcButton>
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
  import { ref, type PropType, computed } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { GraphDataUtils } from '../utils/graphDataUtils';
  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import { type Account, useAccountStore } from '../stores/accountStore';
  import { useAccountService } from '../services/accountService';

  import { useSettingStore } from '../stores/settingStore';

  import SeamlessInput from './SeamlessInput.vue';
  import CurrencyText from './CurrencyText.vue';
  import TransactionImportDialog from './TransactionImportDialog.vue';
  import LineChart, { type Data } from './charts/LineChart.vue';
  import BarChart, { type DataItem } from './charts/BarChart.vue';

  import NcActions from '@nextcloud/vue/dist/Components/NcActions.js';
  import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js';
  import NcButton from '@nextcloud/vue/dist/Components/NcButton.js';

  import Upload from 'vue-material-design-icons/Upload.vue';
  import Plus from 'vue-material-design-icons/Plus.vue';

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

  const balance = computed(() => {
    const accountStats = accountStore.getStats({ accountId: props.account.id });

    if (isMonthlyAccount.value) {
      return accountStats?.value ?? 0.0;
    } else {
      return accountStats?.balance ?? 0.0;
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

  async function handleAccountNameModified(newName: string): Promise<void> {
    props.account.name = newName;
    await handleAccountModified();
  }

  async function handleAccountDescriptionModified(
    newDescription: string
  ): Promise<void> {
    props.account.description = newDescription;
    await handleAccountModified();
  }

  async function handleAccountModified(): Promise<void> {
    await accountService.updateAccount(props.account);
  }
</script>
