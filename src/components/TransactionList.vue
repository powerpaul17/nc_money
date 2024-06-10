<template>
  <div class="flex w-full flex-col overflow-scroll">
    <DynamicScroller
      :items="items"
      :min-item-size="45"
      :emit-update="true"
      @update="onDynamicScrollerUpdate"
    >
      <template #before>
        <NewTransactionInput
          class="mx-2 hidden md:grid"
          :book-id="bookId"
          :account-id="account.id"
          :inverted-value="isInvertedAccount"
        />
      </template>

      <template #default="{ item, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          class="p-1"
        >
          <div
            v-if="item.type === 'headOfGroup'"
            class="mb-5 mt-8 border-b border-solid border-border-dark pb-3 text-center text-xl text-border-dark"
          >
            {{ dayjs(item.transaction.date).format(groupByDateFormat) }}
          </div>

          <TransactionListItem
            :book-id="bookId"
            :transaction="item.transaction"
            :account-id="account.id"
            :inverted-value="isInvertedAccount"
          />
        </DynamicScrollerItem>
      </template>

      <template #after>
        <div
          v-if="transactionStore.allTransactionsFetched.value"
          class="mb-10 mt-3 border-t border-solid border-border-dark pt-5 text-center text-xl text-border-dark"
        >
          {{ t('money', 'End of transactions') }}
        </div>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';

  import {
    ref,
    type PropType,
    computed,
    watch,
    onMounted,
    onUnmounted
  } from 'vue';

  import { translate as t } from '@nextcloud/l10n';

  import { AccountTypeUtils } from '../utils/accountTypeUtils';

  import type { Account } from '../stores/accountStore';
  import {
    type Transaction,
    useTransactionStore
  } from '../stores/transactionStore';
  import { useTransactionService } from '../services/transactionService';

  import { useSettingStore } from '../stores/settingStore';

  import TransactionListItem from './TransactionListItem.vue';
  import NewTransactionInput from './NewTransactionInput.vue';

  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

  const transactionStore = useTransactionStore();
  const transactionService = useTransactionService();
  const settingStore = useSettingStore();

  const props = defineProps({
    bookId: {
      type: Number,
      required: true
    },
    account: {
      type: Object as PropType<Account>,
      required: true
    }
  });

  const transactions = ref<Array<Transaction>>([]);
  const transactionWatcher = ref<{ stop: () => void } | null>(null);
  const accountIsChanging = ref(false);
  const isLoadingTransactions = ref(false);
  const groupBy = ref('month');

  const groupByDateFormat = computed(() => {
    return 'MM.YYYY';
  });

  const isInvertedAccount = computed(() => {
    return (
      settingStore.useInvertedAccounts.value &&
      AccountTypeUtils.isInvertedAccount(props.account.type)
    );
  });

  watch(
    () => props.account,
    async () => {
      await changeAccount();
    }
  );

  const items = computed<
    Array<{
      id: number;
      transaction: Transaction;
      type: 'normal' | 'headOfGroup';
    }>
  >(() => {
    return transactions.value.map((t, index) => ({
      id: t.id,
      transaction: t,
      type: transactionIsHeadOfGroup(t, index) ? 'headOfGroup' : 'normal'
    }));
  });

  async function changeAccount(): Promise<void> {
    accountIsChanging.value = true;

    await transactionService.changeAccount(props.account.id);
    transactions.value = await transactionStore.getByAccountId(
      props.account.id
    );

    if (transactionWatcher.value) {
      transactionWatcher.value.stop();
    }
    transactionWatcher.value = await transactionStore.watchAll((t) => {
      transactions.value = t.slice();
    });

    accountIsChanging.value = false;
  }

  async function loadMoreTransactions(): Promise<void> {
    if (
      accountIsChanging.value ||
      isLoadingTransactions.value ||
      transactionStore.allTransactionsFetched.value
    )
      return;

    isLoadingTransactions.value = true;

    const offset = transactions.value.length;
    await transactionService.fetchAndInsertTransactions(offset);

    isLoadingTransactions.value = false;
  }

  async function onDynamicScrollerUpdate(
    _startIndex: number,
    endIndex: number
  ): Promise<void> {
    if (endIndex + 10 >= transactions.value.length) {
      await loadMoreTransactions();
    }
  }

  function transactionIsHeadOfGroup(
    transaction: Transaction,
    index: number
  ): boolean {
    return (
      !!groupBy.value &&
      (!transactions.value[index - 1] ||
        dayjs(transaction.date).isBefore(
          transactions.value[index - 1]?.date,
          groupBy.value
        ))
    );
  }

  onMounted(() => {
    void changeAccount();
  });

  onUnmounted(() => {
    transactionWatcher.value?.stop();
  });
</script>
