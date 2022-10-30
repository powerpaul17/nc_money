<template>
  <div
    class="
      flex
      w-full
      flex-col
      overflow-scroll
    "
  >
    <DynamicScroller
      :items="items"
      :min-item-size="45"
      :emit-update="true"
      @update="onDynamicScrollerUpdate"
    >
      <template #before>
        <NewTransactionInput
          class="mx-2"
          :account-id="account.id"
        />
      </template>

      <template #default="{ item, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          class="p-2"
        >
          <div
            v-if="item.type === 'headOfGroup'"
            class="
              mt-8
              mb-5
              border-b
              border-solid border-border-dark pb-3
              text-center text-xl text-border-dark
            "
          >
            {{ dayjs(item.transaction.date).format(groupByDateFormat) }}
          </div>

          <TransactionListItem
            :transaction="item.transaction"
            :account-id="account.id"
          />
        </DynamicScrollerItem>
      </template>

      <template #after>
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
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs';

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

  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data(): {
      isLoadingTransactions: boolean;
      groupBy: 'month';
      items: Array<{
        transaction: Transaction;
        type: 'normal'|'headOfGroup'
      }>;
    } {
      return {
        isLoadingTransactions: false,
        groupBy: 'month',
        items: []
      };
    },
    computed: {
      transactions(): Array<Transaction> {
        return this.transactionStore.getByAccountId(this.account.id);
      },
      groupByDateFormat() {
        return 'MM.YYYY';
      }
    },
    watch: {
      async account() {
        await this.changeAccount();
      },
      transactions() {
        this.items = this.transactions.map((t, index) => ({
          id: t.id,
          transaction: t,
          type: this.transactionIsHeadOfGroup(t, index) ? 'headOfGroup' : 'normal'
        }));
      }
    },
    methods: {
      async changeAccount() {
        await this.transactionService.changeAccount(this.account.id);
      },
      async loadMoreTransactions() {
        if(
          this.isLoadingTransactions ||
          this.transactionStore.allTransactionsFetched
        ) return;

        this.isLoadingTransactions = true;

        const offset = this.transactions.length;
        await this.transactionService.fetchAndInsertTransactions(offset);

        this.isLoadingTransactions = false;
      },
      async onDynamicScrollerUpdate(_startIndex: number, endIndex: number) {
        if(endIndex + 10 >= this.transactions.length) {
          await this.loadMoreTransactions();
        }
      },
      transactionIsHeadOfGroup(transaction: Transaction, index: number) {
        return this.groupBy &&
          (
            !this.transactions[index - 1] ||
            dayjs(transaction.date)
              .isBefore(this.transactions[index - 1]?.date, this.groupBy)
          );
      }
    },
    setup() {
      return {
        transactionStore: useTransactionStore(),
        transactionService: useTransactionService(),
        splitStore: useSplitStore(),
        dayjs
      };
    },
    async mounted() {
      await this.changeAccount();
    },
    components: {
      TransactionListItem,
      NewTransactionInput,
      DynamicScroller,
      DynamicScrollerItem
    }
  });
</script>
