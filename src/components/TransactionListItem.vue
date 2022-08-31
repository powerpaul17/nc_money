<template>
  <div class="my-2">
    <div
      class="flex items-center [&>*]:mx-2"
      :class="{ 'bg-yellow-100': isUnbalanced }"
    >
      <div class="flex-shrink-0">
        <DateInput
          :date="transaction.date"
          :placeholder="$t('general.date')"
          @date-changed="handleDateChanged"
        ></DateInput>
      </div>
      <div class="flex-auto">
        <SeamlessInput
          :placeholder="$t('general.description')"
          :value="transaction.description"
          @value-changed="handleDescriptionChanged"
        ></SeamlessInput>
      </div>
      <div>
        <span v-if="hasMultipleDestinationSplits">( Multiple Accounts )</span>
        <AccountSelect
          v-else
          :account-id="destinationAccountId"
          :editable="valueIsEditable"
          :excludedAccountIds="excludedAccountIds"
          @account-changed="handleDestinationAccountChanged"
        ></AccountSelect>
      </div>
      <div class="flex-shrink-0">
        <CurrencyInput
          :value="value"
          :editable="valueIsEditable"
          :placeholder="$t('general.value')"
          @value-changed="handleValueChanged"
        ></CurrencyInput>
      </div>
      <div>
        <div v-if="isLoading" class="icon-loading-small"></div>
        <div v-else class="icon-more" @click="toggleSplits"></div>
      </div>
    </div>
    <div v-if="showSplits" class="bg-gray-100 shadow-inner">
      <SplitListItem
        v-for="split in transaction.splits"
        :key="split.id"
        :split="split"
        :excludedAccountIds="
          excludedSplitAccountIds.filter((aId) => aId !== split.destAccountId)
        "
        @split-deleted="handleSplitDeleted"
      ></SplitListItem>
      <NewSplitInput
        v-if="isUnbalanced"
        :transaction-id="transaction.id"
        :excludedAccountIds="excludedSplitAccountIds"
        :initial-value="-unbalancedValue"
      ></NewSplitInput>
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

  import SplitListItem from './SplitListItem.vue';
  import AccountSelect from './AccountSelect.vue';
  import CurrencyInput from './CurrencyInput.vue';
  import NewSplitInput from './NewSplitInput.vue';
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
    data() {
      return {
        showSplits: false,
        isLoading: false
      };
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
      destinationAccountId() {
        return this.splitOfDestinationAccount?.destAccountId;
      },
      valueIsEditable() {
        return !this.showSplits && !this.hasMultipleDestinationSplits;
      },
      unbalancedValue() {
        return this.transaction.splits.reduce(
          (value, s) => (value += s.value),
          0.0
        );
      },
      isUnbalanced() {
        return this.unbalancedValue !== 0.0;
      },
      excludedAccountIds() {
        if (this.accountId) {
          return [this.accountId];
        } else {
          return [];
        }
      },
      excludedSplitAccountIds() {
        return this.transaction.splits.map((s) => s.destAccountId);
      }
    },
    methods: {
      toggleSplits() {
        this.showSplits = !this.showSplits;
      },
      async handleTransactionChanged() {
        this.isLoading = true;
        await this.transactionStore.updateTransaction(this.transaction);
        this.isLoading = false;
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
      async handleDestinationAccountChanged(accountId?: number) {
        if (this.hasMultipleDestinationSplits)
          throw new Error(
            'cannot change destination account of multi-split-transaction'
          );

        const split = this.splitOfDestinationAccount;
        if (!split) {
          if (accountId) {
            await this.transactionStore.addSplit({
              transactionId: this.transaction.id,
              destAccountId: accountId,
              value: -this.value,
              convertRate: 1.0,
              description: ''
            });
          }
        } else if (accountId) {
          split.destAccountId = accountId;
          await this.handleSplitChanged(split);
        } else {
          await this.handleSplitDeleted(split);
        }
      },
      async handleSplitDeleted(split: Split) {
        this.isLoading = true;
        await this.transactionStore.deleteSplit(split);
        this.isLoading = false;
      },
      async handleSplitChanged(split: Split) {
        this.isLoading = true;
        await this.transactionStore.updateSplit(split);
        this.isLoading = false;
      }
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
    },
    components: {
      SplitListItem,
      CurrencyInput,
      AccountSelect,
      NewSplitInput,
      SeamlessInput,
      DateInput
    }
  });
</script>
