import { computed, reactive, ref, type Ref } from 'vue';

import { defineStore } from 'pinia';

import { useSplitStore } from './splitStore';
import { useAccountStore } from './accountStore';

export const useTransactionStore = defineStore('transactionStore', () => {
  const splitStore = useSplitStore();
  const accountStore = useAccountStore();

  const _transactions: Map<number, Transaction> = reactive(new Map());
  const _currentAccountId: Ref<number|null> = ref(null);
  const _allTransactionsFetched = ref(false);

  function $reset(): void {
    _transactions.clear();
    _currentAccountId.value = null;
    _allTransactionsFetched.value = false;
  }

  const getById = computed(() => {
    return (transactionId: number): Transaction | undefined =>
      _transactions.get(transactionId);
  });

  const getByAccountId = computed(() => {
    return (accountId: number): Array<Transaction> =>
      sortedByDate.value.filter((t) => {
        const splits = splitStore.getByTransactionId(t.id);
        return (
          splits.length &&
          splits.some((s) => s.destAccountId === accountId)
        );
      });
  });

  const sortedByDate = computed(() => {
    return Array.from(_transactions.values()).sort((a, b) => {
      if (b.date.getTime() === a.date.getTime()) {
        return b.timestampAdded - a.timestampAdded;
      }

      return b.date.getTime() - a.date.getTime();
    });
  });

  function insertTransactions(transactions: Array<Transaction>): void {
    for (const transaction of transactions) {
      insertTransaction(transaction);
    }
  }

  function insertTransaction(transaction: Transaction): void {
    const transactionProxy = new Proxy(
      transaction,
      {
        set(target, p, value, receiver): boolean {
          console.warn('TRANSACTION PROXY -->', target, p, value, receiver);

          const splits = splitStore.getByTransactionId(target.id);

          if (p === 'date') {
            for (const split of splits) {
              accountStore.addSummaryValue(
                split.destAccountId,
                -split.value,
                target.date
              );
              accountStore.addSummaryValue(
                split.destAccountId,
                split.value,
                value
              );
            }
          }

          target[p] = value;

          return true;
        }
      }
    );
    _transactions.set(transactionProxy.id, transactionProxy);
  }

  function deleteTransaction(transactionId: number): void {
    _transactions.delete(transactionId);
  }

  return {
    $reset,

    currentAccountId: _currentAccountId,
    allTransactionsFetched: _allTransactionsFetched,

    getById,
    getByAccountId,
    sortedByDate,

    insertTransaction,
    insertTransactions,
    deleteTransaction
  };
});

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;

  // we save this here to keep state used for transaction list item height
  showSplits: boolean;
};
