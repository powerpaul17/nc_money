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

let transactionService: TransactionService|null = null;

export const useTransactionService = (): TransactionService => {
  if (!transactionService) transactionService = new TransactionService();
  return transactionService;
};

class TransactionService {

  private transactionStore = useTransactionStore();
  private transactionApiService = useTransactionApiService();

  private splitService = useSplitService();

  private accountService = useAccountService();

  public async reloadTransactions(): Promise<void> {
    const accountId = this.transactionStore.currentAccountId.value;

    if (accountId) await this.accountService.refreshAccount(accountId);
    await this.changeAccount(accountId);
  }

  public async changeAccount(accountId?: number|null): Promise<void> {
    await this.transactionStore.reset();
    this.transactionStore.currentAccountId.value = accountId ?? null;
    await this.fetchAndInsertTransactions();
  }

  private async fetchTransactionsOfAccount(
    accountId: number,
    offset = 0,
    limit = 100
  ): Promise<Array<Transaction>> {
    return await this.transactionApiService.getTransactionsOfAccount(
      accountId,
      offset,
      limit
    );
  }

  public async fetchTransactionsOfAccountByDate(
    accountId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Array<Transaction>> {
    return await this.transactionApiService.getTransactionsOfAccountByDate(
      accountId,
      startDate,
      endDate
    );
  }

  public async fetchUnbalancedTransactions(offset = 0, limit = 100): Promise<Array<Transaction>> {
    return await this.transactionApiService.getUnbalancedTransactions(offset, limit);
  }

  public async fetchAndInsertTransactions(offset = 0, limit = 100): Promise<void> {
    if (this.transactionStore.allTransactionsFetched.value) return;

    let transactions = [];

    if (this.transactionStore.currentAccountId.value) {
      transactions = await this.fetchTransactionsOfAccount(
        this.transactionStore.currentAccountId.value,
        offset,
        limit
      );
    } else {
      transactions = await this.fetchUnbalancedTransactions(offset, limit);
    }

    await this.transactionStore.insertTransactions(transactions);

    if (transactions.length < limit)
      this.transactionStore.allTransactionsFetched.value = true;
  }

  public async addTransaction(
    transaction: TransactionCreationData,
    addToStore = true
  ): Promise<Transaction> {
    const newTransaction = await this.transactionApiService.addTransaction(
      transaction
    );

    if (addToStore) await this.transactionStore.insertTransaction(newTransaction);

    return newTransaction;
  }

  public async updateTransaction(transaction: Transaction): Promise<void> {
    // TODO: find better way to support updates of dates!
    await this.transactionStore.insertTransaction(
      await this.transactionApiService.updateTransaction(transaction)
    );
  }

  public async addTransactionWithSplits(
    transaction: TransactionWithSplitsCreationData,
    addToStore = true
  ): Promise<{
    transaction: Transaction;
    srcSplit: Split;
    destSplit?: Split;
  }> {
    const newTransaction = await this.addTransaction(
      {
        date: transaction.date,
        description: transaction.description
      },
      addToStore
    );

    let newDestSplit;
    if (transaction.destAccountId) {
      newDestSplit = await this.splitService.addSplit(
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

    const newSrcSplit = await this.splitService.addSplit(
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

  public async addTransactionsWithSplits(
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
        results.push(await this.addTransactionWithSplits(transaction, addToStore));
      }
    }

    return results;
  }

}
