<template>
  <div
    class="
      overflow-hidden
      rounded-md
      transition-all

      focus-within:bg-background-hover
      focus-within:shadow-md

      hover:bg-background-hover
      hover:shadow-md

      dark:bg-background-dark
    "
  >
    <TransactionListItemTemplate
      :item-class="{
        'bg-unbalanced dark:bg-unbalanced-dark': isUnbalanced
      }"
    >
      <template #actionFirst>
        <div @click="toggleSplits">
          <NcLoadingIcon
            v-if="isLoading"
          />
          <ChevronDown v-else-if="transaction.showSplits" />
          <ChevronRight v-else />
        </div>
      </template>

      <template #date>
        <DateInput
          :date="transaction.date"
          :placeholder="t('money', 'Date')"
          @date-changed="handleDateChanged"
        />
      </template>

      <template #description>
        <SeamlessInput
          :placeholder="t('money', 'Description')"
          :value="transaction.description"
          @value-changed="handleDescriptionChanged"
        />
      </template>

      <template #account>
        <span
          v-if="hasMultipleDestinationSplits"
          class="whitespace-nowrap"
        >
          ( {{ t('money', 'Multiple Accounts') }} )
        </span>
        <AccountSelect
          v-else
          :account-id="destinationAccountId"
          :editable="valueIsEditable"
          :excluded-account-ids="excludedAccountIds"
          @account-changed="handleDestinationAccountChanged"
        />
      </template>

      <template #amount>
        <CurrencyInput
          :value="value"
          :editable="valueIsEditable"
          :placeholder="t('money', 'Value')"
          :inverted-value="invertedValue"
          @value-changed="handleValueChanged"
        />
      </template>
    </TransactionListItemTemplate>
    <div
      v-if="transaction.showSplits"
      class="
        bg-gray-100
        shadow-inner
        dark:bg-background-darker
      "
    >
      <SplitListItem
        v-for="split in splits"
        :key="split.id"
        :split="split"
        :excluded-account-ids="
          excludedSplitAccountIds.filter((aId) => aId !== split.destAccountId)
        "
        :inverted-value="invertedValue"
        @split-deleted="handleSplitDeleted"
      />
      <NewSplitInput
        v-if="isUnbalanced"
        :transaction-id="transaction.id"
        :excluded-account-ids="excludedSplitAccountIds"
        :initial-value="-unbalancedValue"
        :inverted-value="invertedValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

  import { ref, type PropType, watch, computed, onMounted, onUnmounted } from 'vue';

  import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
  import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';

  import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon';

  import { NumberUtils } from '../utils/numberUtils';

  import type { Transaction } from '../stores/transactionStore';
  import { useTransactionService } from '../services/transactionService';
  import { useSplitStore, type Split } from '../stores/splitStore';
  import { useSplitService } from '../services/splitService';

  import TransactionListItemTemplate from './TransactionListItemTemplate.vue';
  import SplitListItem from './SplitListItem.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import NewSplitInput from './NewSplitInput.vue';
  import SeamlessInput from './SeamlessInput.vue';
  import DateInput from './DateInput.vue';

  const transactionService = useTransactionService();
  const splitStore = useSplitStore();
  const splitService = useSplitService();

  const props = defineProps({
    transaction: {
      type: Object as PropType<Transaction>,
      required: true
    },
    accountId: {
      type: Number,
      default: undefined
    },
    invertedValue: {
      type: Boolean,
      default: false
    }
  });

  const splits = ref<Array<Split>>([]);
  const transactionIdWatcher = ref<{ stop: () => void }|null>(null);
  const isLoading = ref(false);

  watch(() => props.transaction, async () => {
    removeTransactionIdWatcher();
    await setTransactionIdWatcher();
  });

  const value = computed(() => {
    return splitsOfAccount.value.reduce((v, split) => {
      return (v += split.value);
    }, 0.0);
  });

  const splitOfAccount = computed(() => {
    return splitsOfAccount.value.length > 1
      ? undefined
      : splitsOfAccount.value[0];
  });

  const splitsOfAccount = computed(() => {
    return splits.value.filter((s) => s.destAccountId === props.accountId);
  });

  const splitOfDestinationAccount = computed(() => {
    return hasMultipleDestinationSplits.value
      ? undefined
      : splitsOfDestinationAccounts.value[0];
  });

  const splitsOfDestinationAccounts = computed(() => {
    return splits.value.filter(
      (s) => props.accountId && s.destAccountId !== props.accountId
    );
  });

  const hasMultipleDestinationSplits = computed(() => {
    return splitsOfDestinationAccounts.value.length > 1;
  });

  const destinationAccountId = computed(() => {
    return splitOfDestinationAccount.value?.destAccountId;
  });

  const valueIsEditable = computed(() => {
    return !props.transaction.showSplits && !hasMultipleDestinationSplits.value;
  });

  const unbalancedValue = computed(() => {
    return splits.value.reduce((value, s) => (value += s.value), 0.0);
  });

  const isUnbalanced = computed(() => {
    return NumberUtils.areNotEqual(unbalancedValue.value, 0.0);
  });

  const excludedAccountIds = computed((): Array<number> => {
    if (props.accountId) {
      return [ props.accountId ];
    } else {
      return [];
    }
  });

  function toggleSplits(): void {
    props.transaction.showSplits = !props.transaction.showSplits;
  }

  async function handleTransactionChanged(): Promise<void> {
    isLoading.value = true;
    await transactionService.updateTransaction(props.transaction);
    isLoading.value = false;
  }

  async function handleDateChanged(date: Date): Promise<void> {
    props.transaction.date = date;
    await handleTransactionChanged();
  }

  async function handleDescriptionChanged(description: string): Promise<void> {
    props.transaction.description = description;
    await handleTransactionChanged();
  }

  async function handleValueChanged(value: number): Promise<void> {
    if (hasMultipleDestinationSplits.value)
      throw new Error('cannot change value of multi-split-transaction');

    const split = splitOfDestinationAccount.value;
    if (!split) {
      // TODO
    } else {
      split.value = -value;
      await handleSplitChanged(split);
    }

    const splitOfAcc = splitOfAccount.value;
    if (splitOfAcc) {
      splitOfAcc.value = value;
      await handleSplitChanged(splitOfAcc);
    } else {
      // TODO
    }
  }

  async function handleDestinationAccountChanged(accountId?: number): Promise<void> {
    if (hasMultipleDestinationSplits.value)
      throw new Error(
        'cannot change destination account of multi-split-transaction'
      );

    const split = splitOfDestinationAccount.value;
    if (!split) {
      if (accountId) {
        await splitService.addSplit({
          transactionId: props.transaction.id,
          destAccountId: accountId,
          value: -value.value,
          convertRate: 1.0,
          description: ''
        });
      }
    } else if (accountId) {
      split.destAccountId = accountId;
      await handleSplitChanged(split);
    } else {
      await handleSplitDeleted(split);
    }
  }

  async function handleSplitDeleted(split: Split): Promise<void> {
    await splitService.deleteSplit(split);
  }

  async function handleSplitChanged(split: Split): Promise<void> {
    isLoading.value = true;
    await splitService.updateSplit(split);
    isLoading.value = false;
  }

  function removeTransactionIdWatcher(): void {
    transactionIdWatcher.value?.stop();
    transactionIdWatcher.value = null;
  }

  async function setTransactionIdWatcher(): Promise<void> {
    const transactionId = props.transaction.id;

    const watcher = await splitStore.watchForTransactionId(transactionId, (s) => {
      splits.value = s;
    });

    if (transactionId !== props.transaction.id) {
      watcher.stop();
    } else {
      transactionIdWatcher.value = watcher;
    }
  }

  onMounted(() => {
    void setTransactionIdWatcher();
  });

  onUnmounted(() => {
    removeTransactionIdWatcher();
  });

</script>
