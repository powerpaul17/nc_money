<template>
  <TransactionListItemTemplate @keyup.enter="handleSubmitTransactionClick()">
    <template #date>
      <DateInput
        :date="date"
        :placeholder="t('money', 'Date')"
        @date-changed="(newDate) => (date = newDate)"
      />
    </template>

    <template #description>
      <SeamlessInput
        :value="description"
        :placeholder="t('money', 'Description')"
        @value-changed="(newDescription) => (description = newDescription)"
      />
    </template>

    <template #account>
      <AccountSelect
        :book-id="bookId"
        :account-id="destAccountId"
        :excluded-account-ids="[accountId]"
        @account-changed="(accountId) => (destAccountId = accountId)"
      />
    </template>

    <template #amount>
      <CurrencyInput
        :value="value"
        :enable-convert-rate="enableConvertRate"
        :convert-rate="convertRate"
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        @value-changed="(newValue) => (value = newValue)"
        @convert-rate-changed="
          (newConvertRate) => (convertRate = newConvertRate)
        "
      />
    </template>

    <template #actionLast>
      <div
        v-if="isLoading"
        class="icon-loading-small"
      />
      <NcIconSvgWrapper
        v-else
        :path="mdiPlus"
        :class="{ 'opacity-25': !isValid }"
        @click="() => isValid && handleSubmitTransactionClick()"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import { ref, computed } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { NcIconSvgWrapper } from '@nextcloud/vue';

  import { NumberUtils } from '../utils/numberUtils';
  import { DateUtils } from '../utils/DateUtils';

  import { useTransactionService } from '../services/transactionService';

  import { useAccountStore } from '../stores/accountStore';

  import { mdiPlus } from '@mdi/js';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import DateInput from './DateInput.vue';
  import SeamlessInput from './SeamlessInput.vue';

  const transactionService = useTransactionService();

  const accountStore = useAccountStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    accountId: {
      type: Number,
      required: true
    },
    invertedValue: {
      type: Boolean,
      default: false
    }
  });

  const date = ref(new Date());
  const description = ref('');
  const destAccountId = ref(null);
  const value = ref(0.0);
  const convertRate = ref(1.0);
  const isLoading = ref(false);

  const account = computed(() => {
    return accountStore.getById(props.accountId);
  });

  const destAccount = computed(() => {
    return destAccountId.value
      ? accountStore.getById(destAccountId.value)
      : null;
  });

  const enableConvertRate = computed(() => {
    return (
      !!account.value &&
      !!destAccount.value &&
      account.value.currency !== destAccount.value.currency
    );
  });

  const isValid = computed(() => {
    return NumberUtils.areNotEqual(value.value, 0.0);
  });

  async function handleSubmitTransactionClick(): Promise<void> {
    if (!isValid.value) return;

    await createNewTransaction();
  }

  async function createNewTransaction(): Promise<void> {
    isLoading.value = true;

    await transactionService.addTransactionWithSplits({
      date: DateUtils.getDateStringForTransaction(date.value),
      description: description.value,
      value: -value.value,
      convertRate: 1 / convertRate.value,
      srcAccountId: props.accountId,
      destAccountId: destAccountId.value
    });

    isLoading.value = false;

    resetFields();
  }

  function resetFields(): void {
    description.value = '';
    value.value = 0.0;
  }
</script>
