<template>
  <TransactionListItemTemplate>
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
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        @value-changed="(newValue) => (value = newValue)"
      />
    </template>

    <template #actionLast>
      <div
        v-if="isLoading"
        class="icon-loading-small"
      />
      <Plus
        v-else
        :class="{ 'opacity-25': !isValid }"
        @click="() => isValid && handleSubmitTransactionClick()"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { NumberUtils } from '../utils/numberUtils';

  import { useTransactionService } from '../services/transactionService';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import DateInput from './DateInput.vue';
  import SeamlessInput from './SeamlessInput.vue';

  const transactionService = useTransactionService();

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
  const isLoading = ref(false);

  const isValid = computed(() => {
    return NumberUtils.areNotEqual(value.value, 0.0);
  });

  async function handleSubmitTransactionClick(): Promise<void> {
    // TODO validation
    await createNewTransaction();
  }

  async function createNewTransaction(): Promise<void> {
    isLoading.value = true;
    await transactionService.addTransactionWithSplits({
      date: date.value,
      description: description.value,
      value: -value.value,
      convertRate: 1.0,
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
