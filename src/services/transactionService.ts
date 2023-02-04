import { defineStore } from 'pinia';

import { ArrayUtils } from '../utils/arrayUtils';

import {
  useTransactionApiService,
  type TransactionCreationData,
  type TransactionWithSplitsCreationData
} from './transactionApiService';
import { useSplitService } from './splitService';
import { useAccountService } from './accountService';
import { useTransactionStore, type Transaction } from '../stores/transactionStore';
import type { Split } from '../stores/splitStore';

export const useTransactionService = defineStore('transactionService', () => {
  const transactionStore = useTransactionStore();
  const transactionApiService = useTransactionApiService();

  const splitService = useSplitService();

  const accountService = useAccountService();

  async function reloadTransactions(): Promise<void> {
    const accountId = transactionStore.currentAccountId;

    if (accountId) await accountService.refreshAccount(accountId);
    await changeAccount(accountId);
  }

  async function changeAccount(accountId?: number|null): Promise<void> {
    await transactionStore.reset();
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

  async function fetchTransactionsOfAccountByDate(
    accountId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Array<Transaction>> {
    return await transactionApiService.getTransactionsOfAccountByDate(
      accountId,
      startDate,
      endDate
    );
  }

  async function fetchUnbalancedTransactions(offset = 0, limit = 100): Promise<Array<Transaction>> {
    return await transactionApiService.getUnbalancedTransactions(offset, limit);
  }

  async function fetchAndInsertTransactions(offset = 0, limit = 100): Promise<void> {
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

    await transactionStore.insertTransactions(transactions);

    if (transactions.length < limit)
      transactionStore.allTransactionsFetched = true;
  }

  async function addTransaction(
    transaction: TransactionCreationData,
    addToStore = true
  ): Promise<Transaction> {
    const newTransaction = await transactionApiService.addTransaction(
      transaction
    );

    if (addToStore) await transactionStore.insertTransaction(newTransaction);

    return newTransaction;
  }

  async function updateTransaction(transaction: Transaction): Promise<void> {
    // TODO: find better way to support updates of dates!
    await transactionStore.insertTransaction(
      await transactionApiService.updateTransaction(transaction)
    );
  }

  async function addTransactionWithSplits(
    transaction: TransactionWithSplitsCreationData,
    addToStore = true
  ): Promise<{
    transaction: Transaction;
    srcSplit: Split;
    destSplit?: Split;
  }> {
    const newTransaction = await addTransaction(
      {
        date: transaction.date,
        description: transaction.description
      },
      addToStore
    );

    let newDestSplit;
    if (transaction.destAccountId) {
      newDestSplit = await splitService.addSplit(
        {
          transactionId: newTransaction.id,
          destAccountId: transaction.destAccountId,
          convertRate: transaction.convertRate,
          description: transaction.destSplitComment ?? '',
          value: transaction.value / transaction.convertRate
        },
        addToStore
      );
    }

    const newSrcSplit = await splitService.addSplit(
      {
        transactionId: newTransaction.id,
        destAccountId: transaction.srcAccountId,
        convertRate: 1.0,
        description: transaction.srcSplitComment ?? '',
        value: -transaction.value
      },
      addToStore
    );

    return {
      transaction: newTransaction,
      srcSplit: newSrcSplit,
      destSplit: newDestSplit
    };
  }

  async function addTransactionsWithSplits(
    transactions: Array<TransactionWithSplitsCreationData>,
    addToStore = true
  ): Promise<Array<{
    transaction: Transaction;
    srcSplit: Split;
    destSplit?: Split;
  }>> {
    const results = [];

    const chunkSize = 10;
    const chunks = ArrayUtils.chunk(transactions, chunkSize);

    for (const chunk of chunks) {
      for (const transaction of chunk) {
        results.push(await addTransactionWithSplits(transaction, addToStore));
      }
    }

    return results;
  }

  return {
    addTransaction,
    updateTransaction,

    addTransactionWithSplits,
    addTransactionsWithSplits,

    reloadTransactions,
    changeAccount,

    fetchTransactionsOfAccountByDate,
    fetchAndInsertTransactions
  };
});
