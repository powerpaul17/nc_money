<template>
  <TransactionListItemTemplate>
    <template #description>
      <SeamlessInput
        :placeholder="t('money', 'Description')"
        :value="split.description"
        @value-changed="handleDescriptionChanged"
      />
    </template>

    <template #account>
      <AccountSelect
        :account-id="split.destAccountId"
        :excluded-account-ids="excludedAccountIds"
        @account-changed="handleDestinationAccountChanged"
      />
    </template>

    <template #amount>
      <CurrencyInput
        :value="split.value"
        :placeholder="t('money', 'Value')"
        :inverted-value="invertedValue"
        @value-changed="handleValueChanged"
      />
    </template>

    <template #actionLast>
      <div
        v-if="showLoadingIcon"
        class="icon-loading-small"
      />
      <div
        v-else
        class="icon-delete"
        @click="handleDeleteSplit"
      />
    </template>
  </TransactionListItemTemplate>
</template>

<script setup lang="ts">

  import { ref, type PropType, watch, onMounted } from 'vue';

  import type { Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import AccountSelect from './AccountSelect.vue';
  import SeamlessInput from './SeamlessInput.vue';

  const splitService = useSplitService();

  const props = defineProps({
    split: {
      type: Object as PropType<Split>,
      required: true
    },
    excludedAccountIds: {
      type: Array as PropType<Array<number>>,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    invertedValue: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits([ 'split-deleted' ]);

  const showLoadingIcon = ref(false);

  watch(() => props.isLoading, () => {
    showLoadingIcon.value = props.isLoading;
  });

  async function handleValueChanged(value: number): Promise<void> {
    props.split.value = value;
    await handleSplitChanged();
  }

  function handleDeleteSplit(): void {
    showLoadingIcon.value = true;
    emit('split-deleted', props.split);
  }

  async function handleDescriptionChanged(description: string): Promise<void> {
    props.split.description = description;
    await handleSplitChanged();
  }

  async function handleDestinationAccountChanged(accountId: number|null): Promise<void> {
    if(accountId) {
      props.split.destAccountId = accountId;
      await handleSplitChanged();
    } else {
      handleDeleteSplit();
    }
  }

  async function handleSplitChanged(): Promise<void> {
    showLoadingIcon.value = true;
    await splitService.updateSplit(props.split);
    showLoadingIcon.value = false;
  }

  onMounted(() => {
    showLoadingIcon.value = props.isLoading;
  });

</script>
