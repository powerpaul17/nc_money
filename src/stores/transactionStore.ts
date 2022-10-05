import { computed, reactive, ref, type Ref } from 'vue';

import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transactionStore', () => {
  const _transactions: Map<number, Transaction> = reactive(new Map());
  const _currentAccountId: Ref<number|null> = ref(null);
  const _allTransactionsFetched = ref(false);

  function $reset() {
    _transactions.clear();
    _currentAccountId.value = null;
    _allTransactionsFetched.value = false;
  }

  const getById = computed(() => {
    return (transactionId: number) => _transactions.get(transactionId);
  });

  const sortedByDate = computed(() => {
    return Array.from(_transactions.values()).sort((a, b) => {
      if (b.date.getTime() === a.date.getTime()) {
        return b.timestampAdded - a.timestampAdded;
      }

      return b.date.getTime() - a.date.getTime();
    });
  });

  function insertTransactions(transactions: Array<Transaction>) {
    for (const transaction of transactions) {
      _transactions.set(transaction.id, transaction);
    }
  }

  function insertTransaction(transaction: Transaction) {
    _transactions.set(transaction.id, transaction);
  }

  function deleteTransaction(transactionId: number) {
    _transactions.delete(transactionId);
  }

  return {
    $reset,

    currentAccountId: _currentAccountId,
    allTransactionsFetched: _allTransactionsFetched,

    getById,
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
};
