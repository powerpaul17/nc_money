import { defineStore } from 'pinia';

import {
  useTransactionApiService,
  type TransactionCreationData,
  type TransactionWithSplitsCreationData
} from '../services/transactionApiService';
import { useTransactionStore, type Transaction } from './transactionStore';

export const useTransactionService = defineStore('transactionService', () => {
  const transactionStore = useTransactionStore();
  const transactionApiService = useTransactionApiService();

  async function reloadTransactions() {
    await changeAccount(transactionStore.currentAccountId);
  }

  async function changeAccount(accountId?: number | null) {
    transactionStore.$reset();
    transactionStore.currentAccountId = accountId ?? null;
    await fetchAndInsertTransactions();
  }

  async function fetchTransactionsOfAccount(
    accountId: number,
    offset = 0,
    limit = 100
  ): Promise<Array<Transaction>> {
    return await transactionApiService.getTransactionsOfAccount(
      accountId,
      offset,
      limit
    );
  }

  async function fetchUnbalancedTransactions(offset = 0, limit = 100) {
    return await transactionApiService.getUnbalancedTransactions(offset, limit);
  }

  async function fetchAndInsertTransactions(offset = 0, limit = 100) {
    if (transactionStore.allTransactionsFetched) return;

    let transactions = [];

    if (transactionStore.currentAccountId) {
      transactions = await fetchTransactionsOfAccount(
        transactionStore.currentAccountId,
        offset,
        limit
      );
    } else {
      transactions = await fetchUnbalancedTransactions(offset, limit);
    }

    transactionStore.insertTransactions(transactions);

    if (transactions.length < limit)
      transactionStore.allTransactionsFetched = true;
  }

  async function addTransaction(
    transaction: TransactionCreationData,
    addToStore = true
  ) {
    const newTransaction = await transactionApiService.addTransaction(
      transaction
    );

    if (addToStore) transactionStore.insertTransaction(newTransaction);

    return newTransaction;
  }

  async function updateTransaction(transaction: Transaction) {
    await transactionApiService.updateTransaction(transaction);
  }

  return {
    addTransaction,
    updateTransaction,

    reloadTransactions,
    changeAccount,

    fetchAndInsertTransactions
  };
});
