import { computed, reactive, ref } from 'vue';

import { defineStore } from 'pinia';

import {
  useTransactionApiService,
  type TransactionCreationData
} from '../services/transactionApiService';

export const useTransactionStore = defineStore('transaction', () => {
  const _transactions = reactive<Map<number, Transaction>>(new Map());
  const _currentAccountId = ref<number | null>(null);
  const _allTransactionsFetched = ref(false);

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

  async function changeAccount(accountId?: number | null) {
    reset();
    _currentAccountId.value = accountId ?? null;
    await fetchAndInsertTransactions();
  }

  function reset() {
    _transactions.clear();
    _currentAccountId.value = null;
    _allTransactionsFetched.value = false;
  }

  async function fetchAndInsertTransactions(offset = 0, limit = 100) {
    if (_allTransactionsFetched.value) return;

    let transactions = [];

    if (_currentAccountId.value) {
      transactions = await fetchTransactionsOfAccount(
        _currentAccountId.value,
        offset,
        limit
      );
    } else {
      transactions = await fetchUnbalancedTransactions(offset, limit);
    }

    insertTransactions(transactions);

    if (transactions.length < limit) _allTransactionsFetched.value = true;
  }

  async function fetchTransactionsOfAccount(
    accountId: number,
    offset = 0,
    limit = 100
  ): Promise<Array<Transaction>> {
    const transactionApiService = useTransactionApiService();
    return await transactionApiService.getTransactionsOfAccount(
      accountId,
      offset,
      limit
    );
  }

  async function fetchUnbalancedTransactions(offset = 0, limit = 100) {
    const transactionApiService = useTransactionApiService();
    return await transactionApiService.getUnbalancedTransactions(offset, limit);
  }

  function insertTransactions(transactions: Array<Transaction>) {
    for (const transaction of transactions) {
      _transactions.set(transaction.id, transaction);
    }
  }

  async function addTransaction(
    transaction: TransactionCreationData,
    addToStore = true
  ) {
    const transactionApiService = useTransactionApiService();
    const newTransaction = await transactionApiService.addTransaction(
      transaction
    );

    if (addToStore) _transactions.set(newTransaction.id, newTransaction);

    return newTransaction;
  }

  async function updateTransaction(transaction: Transaction) {
    const transactionApiService = useTransactionApiService();
    await transactionApiService.updateTransaction(transaction);
  }

  return {
    allTransactionsFetched: _allTransactionsFetched,

    getById,
    sortedByDate,

    changeAccount,
    fetchAndInsertTransactions,
    addTransaction,
    updateTransaction
  };
});

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;
};
