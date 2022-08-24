<template>
  <div class="my-2">
    <div
      class="flex items-center [&>*]:mx-2"
      :class="{ 'bg-yellow-100': isUnbalanced }"
    >
      <div class="flex-shrink-0">
        <DateInput
          :date="transaction.date"
          placeholder="Date..."
          @date-changed="handleDateChanged"
        ></DateInput>
      </div>
      <div class="flex-auto">
        <SeamlessInput
          class="border-0 overflow-hidden text-ellipsis bg-transparent"
          placeholder="Description..."
          :value="transaction.description"
          @value-changed="handleDescriptionChanged"
        ></SeamlessInput>
      </div>
      <div>
        <span v-if="hasMultipleDestinationSplits">( Multiple Accounts )</span>
      </div>
      <div class="flex-shrink-0">
        <CurrencyInput
          :value="value"
          placeholder="Value..."
          @value-changed="handleValueChanged"
        ></CurrencyInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import {
    useTransactionStore,
    type Split,
    type Transaction
  } from '../stores/transactionStore';

  import CurrencyInput from './CurrencyInput.vue';
  import SeamlessInput from './SeamlessInput.vue';
  import DateInput from './DateInput.vue';

  export default defineComponent({
    props: {
      transaction: {
        type: Object as PropType<Transaction>,
        required: true
      },
      accountId: {
        type: Number
      }
    },
    computed: {
      value() {
        return this.splitsOfAccount.reduce((v, split) => {
          return (v += split.value);
        }, 0.0);
      },
      splitOfAccount() {
        return this.splitsOfAccount.length > 1
          ? undefined
          : this.splitsOfAccount[0];
      },
      splitsOfAccount() {
        return this.transaction.splits.filter(
          (s) => s.destAccountId === this.accountId
        );
      },
      splitOfDestinationAccount() {
        return this.hasMultipleDestinationSplits
          ? undefined
          : this.splitsOfDestinationAccounts[0];
      },
      splitsOfDestinationAccounts() {
        return this.transaction.splits.filter(
          (s) => this.accountId && s.destAccountId !== this.accountId
        );
      },
      hasMultipleDestinationSplits() {
        return this.splitsOfDestinationAccounts.length > 1;
      },
      unbalancedValue() {
        return this.transaction.splits.reduce(
          (value, s) => (value += s.value),
          0.0
        );
      },
      isUnbalanced() {
        return this.unbalancedValue !== 0.0;
      }
    },
    methods: {
      async handleTransactionChanged() {
        await this.transactionStore.updateTransaction(this.transaction);
      },
      async handleDateChanged(date: Date) {
        this.transaction.date = date;
        await this.handleTransactionChanged();
    },
      async handleDescriptionChanged(description: string) {
        this.transaction.description = description;
        await this.handleTransactionChanged();
      },
      async handleValueChanged(value: number) {
        if (this.hasMultipleDestinationSplits)
          throw new Error('cannot change value of multi-split-transaction');

        const split = this.splitOfDestinationAccount;
        if (!split) {
          // TODO
        } else {
          split.value = -value;
          await this.handleSplitChanged(split);
        }

        const splitOfAccount = this.splitOfAccount;
        if (splitOfAccount) {
          splitOfAccount.value = value;
          await this.handleSplitChanged(splitOfAccount);
        } else {
          // TODO
        }
      },
      async handleSplitChanged(split: Split) {
        await this.transactionStore.updateSplit(split);
      }
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
    },
    components: {
      CurrencyInput,
      SeamlessInput,
      DateInput
    }
  });
</script>
