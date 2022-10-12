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
      :items="transactions"
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
          <TransactionListItem
            :transaction="item"
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

  import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

  export default defineComponent({
    props: {
      account: {
        type: Object as PropType<Account>,
        required: true
      }
    },
    data(): {
      isLoadingTransactions: boolean;
    } {
      return {
        isLoadingTransactions: false
      };
    },
    computed: {
      transactions(): Array<Transaction> {
        return this.transactionStore.getByAccountId(this.account.id);
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
      NewTransactionInput,
      DynamicScroller,
      DynamicScrollerItem
    }
  });
</script>
