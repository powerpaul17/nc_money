<template>
  <div
    class="flex w-full flex-col overflow-scroll"
    @scroll="handleScroll"
  >
    <NewTransactionInput
      class="mx-2"
      :account-id="account.id"
    />

    <div>
      <template
        v-for="transaction in transactions"
        :key="transaction.id"
      >
        <TransactionListItem
          :transaction="transaction"
          :account-id="account.id"
        />
      </template>
    </div>

    <div
      v-if="isLoadingTransactions"
      class="loading h-[50px]"
    />

    <div
      v-if="transactionStore.allTransactionsFetched"
      class="
        mt-3 mb-10
        border-t border-solid border-border-dark
        pt-5
        text-center text-xl text-border-dark
      "
    >
      {{ t('money', 'End of transactions') }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { Account } from '../stores/accountStore';
  import {
    type Transaction,
    useTransactionStore
  } from '../stores/transactionStore';
  import { useSplitStore } from '../stores/splitStore';
  import { useTransactionService } from '../services/transactionService';

  import TransactionListItem from './TransactionListItem.vue';
  import NewTransactionInput from './NewTransactionInput.vue';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data() {
      return {
        itemHeight: 40, // TODO calculate this somehow
        isLoadingTransactions: true
      };
    },
    computed: {
      transactions(): Array<Transaction> {
        return this.transactionStore.sortedByDate.filter((t) => {
          const splits = this.splitStore.getByTransactionId(t.id);
          return (
            splits.length &&
            splits.some((s) => s.destAccountId === this.account.id)
          );
        });
      },
      numberOfTransactions() {
        return this.transactions.length;
      },
      scrollerHeight() {
        return this.numberOfTransactions * this.itemHeight;
      }
    },
    watch: {
      async account() {
        await this.changeAccount();
      }
    },
    methods: {
      async changeAccount() {
        await this.transactionService.changeAccount(this.account.id);
        await this.loadMoreTransactionsIfRequired();
      },
      async handleScroll() {
        await this.loadMoreTransactionsIfRequired();
      },
      async loadMoreTransactionsIfRequired() {
        if (
          this.$el.scrollTop + this.$el.clientHeight >=
            this.scrollerHeight - this.itemHeight &&
          !this.transactionStore.allTransactionsFetched
        ) {
          this.isLoadingTransactions = true;

          await this.loadMoreTransactions();

          setTimeout(() => {
            this.loadMoreTransactionsIfRequired();
          }, 0);
        } else {
          this.isLoadingTransactions = false;
        }
      },
      async loadMoreTransactions() {
        const offset = this.numberOfTransactions;
        await this.transactionService.fetchAndInsertTransactions(offset);
      }
    },
    setup() {
      return {
        transactionStore: useTransactionStore(),
        transactionService: useTransactionService(),
        splitStore: useSplitStore()
      };
    },
    async mounted() {
      await this.changeAccount();
    },
    components: {
      TransactionListItem,
      NewTransactionInput
    }
  });
</script>
