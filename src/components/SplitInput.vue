<template>
  <div class="grid grid-cols-2">
    <AccountSelect
      :book-id="bookId"
      :account-id="split.destAccountId"
      :editable="editable"
      :excluded-account-ids="
        excludedAccountIds.filter(
          (accountId) => accountId !== split.destAccountId
        )
      "
      @account-changed="handleSplitAccountChanged(split, $event)"
    />
    <CurrencyInput
      :value="split.value"
      :editable="editable"
      :placeholder="t('money', 'Value')"
      :inverted-value="invertedValue"
      @value-changed="handleSplitValueChanged(split, $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';

  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  const splitService = useSplitService();

  defineProps({
    bookId: {
      type: Number,
      required: true
    },
    split: {
      type: Object as PropType<Split>,
      required: true
    },
    excludedAccountIds: {
      type: Array as PropType<Array<number>>,
      default: () => []
    },
    invertedValue: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    }
  });

  async function handleSplitAccountChanged(
    split: Split,
    accountId?: number
  ): Promise<void> {
    if (accountId) {
      split.destAccountId = accountId;
      await handleSplitChanged(split);
    } else {
      await splitService.deleteSplit(split);
    }
  }

  async function handleSplitValueChanged(
    split: Split,
    value: number
  ): Promise<void> {
    split.value = value;
    await handleSplitChanged(split);
  }

  async function handleSplitChanged(split: Split): Promise<void> {
    await splitService.updateSplit(split);
  }
</script>
