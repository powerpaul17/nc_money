<template>
  <div
    class="
      mx-2 my-3
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
          <ChevronDown v-else-if="showSplits" />
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
          @value-changed="handleValueChanged"
        />
      </template>
    </TransactionListItemTemplate>
    <div
      v-if="showSplits"
      class="bg-gray-100 shadow-inner"
    >
      <SplitListItem
        v-for="split in splits"
        :key="split.id"
        :split="split"
        :excluded-account-ids="
          excludedSplitAccountIds.filter((aId) => aId !== split.destAccountId)
        "
        @split-deleted="handleSplitDeleted"
      />
      <NewSplitInput
        v-if="isUnbalanced"
        :transaction-id="transaction.id"
        :excluded-account-ids="excludedSplitAccountIds"
        :initial-value="-unbalancedValue"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';
  import ChevronDown from 'vue-material-design-icons/ChevronDown.vue';

  import NcLoadingIcon from '@nextcloud-vue/components/NcLoadingIcon';

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
      splits() {
        return this.splitStore.getByTransactionId(this.transaction.id);
      },
      splitOfAccount() {
        return this.splitsOfAccount.length > 1
          ? undefined
          : this.splitsOfAccount[0];
      },
      splitsOfAccount() {
        return this.splits.filter((s) => s.destAccountId === this.accountId);
      },
      splitOfDestinationAccount() {
        return this.hasMultipleDestinationSplits
          ? undefined
          : this.splitsOfDestinationAccounts[0];
      },
      splitsOfDestinationAccounts() {
        return this.splits.filter(
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
        return this.splits.reduce((value, s) => (value += s.value), 0.0);
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
        return this.splits.map((s) => s.destAccountId);
      }
    },
    methods: {
      toggleSplits() {
        this.showSplits = !this.showSplits;
      },
      async handleTransactionChanged() {
        this.isLoading = true;
        await this.transactionService.updateTransaction(this.transaction);
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
            await this.splitService.addSplit({
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
        await this.splitService.deleteSplit(split);
      },
      async handleSplitChanged(split: Split) {
        this.isLoading = true;
        await this.splitService.updateSplit(split);
        this.isLoading = false;
      }
    },
    setup() {
      return {
        transactionService: useTransactionService(),
        splitStore: useSplitStore(),
        splitService: useSplitService()
      };
    },
    components: {
      SplitListItem,
      CurrencyInput,
      AccountSelect,
      NewSplitInput,
      SeamlessInput,
      DateInput,
      ChevronRight,
      ChevronDown,
      NcLoadingIcon,
      TransactionListItemTemplate
    }
  });
</script>
