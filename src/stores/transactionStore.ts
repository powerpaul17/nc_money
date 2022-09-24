import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

import {
  useTransactionApiService,
  type TransactionCreationData
} from '../services/transactionApiService';

export const useTransactionStore = defineStore('transaction', () => {
  const state: State = reactive({
    transactions: new Map(),
    currentAccountId: null,
    allTransactionsFetched: false
  });

  const getById = computed(() => {
    return (transactionId: number) => state.transactions.get(transactionId);
  });

  const sortedByDate = computed(() => {
    return Array.from(state.transactions.values()).sort((a, b) => {
      if (b.date.getTime() === a.date.getTime()) {
        return b.timestampAdded - a.timestampAdded;
      }

      return b.date.getTime() - a.date.getTime();
    });
  });

  async function changeAccount(accountId?: number | null) {
    reset();
    state.currentAccountId = accountId;
    await fetchAndInsertTransactions();
  }

  function reset() {
    state.transactions = new Map();
    state.currentAccountId = null;
    state.allTransactionsFetched = false;
  }

  async function fetchAndInsertTransactions(offset = 0, limit = 100) {
    if (state.allTransactionsFetched) return;

    let transactions = [];

    if (state.currentAccountId) {
      transactions = await fetchTransactionsOfAccount(
        state.currentAccountId,
        offset,
        limit
      );
    } else {
      transactions = await fetchUnbalancedTransactions(offset, limit);
    }

    insertTransactions(transactions);

    if (transactions.length < limit) state.allTransactionsFetched = true;
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
      state.transactions.set(transaction.id, transaction);
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

    if (addToStore) state.transactions.set(newTransaction.id, newTransaction);

    return newTransaction;
  }

  async function updateTransaction(transaction: Transaction) {
    const transactionApiService = useTransactionApiService();
    await transactionApiService.updateTransaction(transaction);
  }

  return {
    allTransactionsFetched: state.allTransactionsFetched,

    getById,
    sortedByDate,

    changeAccount,
    fetchAndInsertTransactions,
    addTransaction,
    updateTransaction
  };
});

type State = {
  transactions: Map<number, Transaction>;
  currentAccountId?: number | null;
  allTransactionsFetched: boolean;
};

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;
};
