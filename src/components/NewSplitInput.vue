<template>
  <TransactionListItemTemplate>
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
        :excluded-account-ids="excludedAccountIds"
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
        @click="isValid && handleSubmitSplitClick()"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script setup lang="ts">
  import { ref, type PropType, watch, computed } from 'vue';

  import { NumberUtils } from '../utils/numberUtils';

  import { useSplitService } from '../services/splitService';

  import Plus from 'vue-material-design-icons/Plus.vue';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import SeamlessInput from './SeamlessInput.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import { onMounted } from 'vue';

  const splitService = useSplitService();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    transactionId: {
      type: Number,
      required: true
    },
    excludedAccountIds: {
      type: Array as PropType<Array<number>>,
      default: () => []
    },
    initialValue: {
      type: Number,
      default: 0.0
    },
    invertedValue: {
      type: Boolean,
      default: false
    }
  });

  const description = ref('');
  const destAccountId = ref(null);
  const value = ref(0.0);
  const isLoading = ref(false);

  watch(
    () => props.initialValue,
    () => {
      value.value = props.initialValue;
    }
  );

  const isValid = computed(() => {
    return (
      destAccountId.value != null && NumberUtils.areNotEqual(value.value, 0.0)
    );
  });

  async function handleSubmitSplitClick(): Promise<void> {
    // TODO validation
    await createNewSplit();
  }

  async function createNewSplit(): Promise<void> {
    if (!destAccountId.value)
      throw new Error('cannot add split without an account id');

    isLoading.value = true;
    await splitService.addSplit({
      transactionId: props.transactionId,
      destAccountId: destAccountId.value,
      value: value.value,
      convertRate: 1.0,
      description: description.value
    });
    isLoading.value = false;

    resetFields();
  }

  function resetFields(): void {
    description.value = '';
    destAccountId.value = null;
    value.value = props.initialValue;
  }

  onMounted(() => {
    value.value = props.initialValue;
  });
</script>
