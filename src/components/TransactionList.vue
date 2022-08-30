<template>
  <div class="flex flex-col w-full overflow-scroll" @scroll="handleScroll">
    <NewTransactionInput :account-id="account.id"></NewTransactionInput>

    <div>
      <template v-for="transaction in transactions" :key="transaction.id">
        <TransactionListItem
          :transaction="transaction"
          :account-id="account.id"
        ></TransactionListItem>
      </template>
    </div>

    <div v-if="isLoadingTransactions" class="loading h-[50px]"></div>

    <div
      v-if="transactionStore.allTransactionsFetched"
      class="text-center text-xl text-border-dark border-t border-border-dark border-solid pt-5 mt-3 mb-10"
    >
      End of transactions
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
        isLoadingTransactions: false
      };
    },
    computed: {
      transactions(): Array<Transaction> {
        return this.transactionStore.sortedByDate.filter(
          (t) =>
            t.splits.length &&
            t.splits.some((s) => s.destAccountId === this.account.id)
        );
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
        await this.transactionStore.changeAccount(this.account.id);
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
        await this.transactionStore.fetchTransactions(offset);
      }
    },
    setup() {
      const transactionStore = useTransactionStore();
      return { transactionStore };
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
