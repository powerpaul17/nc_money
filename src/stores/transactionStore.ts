import { defineStore } from 'pinia';

import {
  useTransactionApiService,
  type TransactionCreationData
} from '../services/transactionApiService';

export const useTransactionStore = defineStore('transaction', {
  state: (): State => ({
    transactions: new Map(),
    currentAccountId: null,
    allTransactionsFetched: false
  }),
  getters: {
    getById(state) {
      return (transactionId: number) => state.transactions.get(transactionId);
    },
    sortedByDate(state) {
      return Array.from(state.transactions.values()).sort((a, b) => {
        if (b.date.getTime() === a.date.getTime()) {
          return b.timestampAdded - a.timestampAdded;
        }

        return b.date.getTime() - a.date.getTime();
      });
    }
  },
  actions: {
    async changeAccount(accountId?: number) {
      this.$reset();
      this.currentAccountId = accountId;
      await this.fetchAndInsertTransactions();
    },
    async fetchAndInsertTransactions(offset = 0, limit = 100) {
      if (this.allTransactionsFetched) return;

      let transactions = [];

      if (this.currentAccountId) {
        transactions = await this.fetchTransactionsOfAccount(
          this.currentAccountId,
          offset,
          limit
        );
      } else {
        transactions = await this.fetchUnbalancedTransactions(offset, limit);
      }

      this.insertTransactions(transactions);

      if (transactions.length < limit) this.allTransactionsFetched = true;
    },
    async fetchTransactionsOfAccount(
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
    },
    async fetchUnbalancedTransactions(offset = 0, limit = 100) {
      const transactionApiService = useTransactionApiService();
      return await transactionApiService.getUnbalancedTransactions(
        offset,
        limit
      );
    },
    insertTransactions(transactions: Array<Transaction>) {
      for (const transaction of transactions) {
        this.transactions.set(transaction.id, transaction);
      }
    },

    // -- TRANSACTIONS --

    async addTransaction(
      transaction: TransactionCreationData,
      addToStore = true
    ) {
      const transactionApiService = useTransactionApiService();
      const newTransaction = await transactionApiService.addTransaction(
        transaction
      );

      if (addToStore) this.transactions.set(newTransaction.id, newTransaction);

      return newTransaction;
    },
    async updateTransaction(transaction: Transaction) {
      const transactionApiService = useTransactionApiService();
      await transactionApiService.updateTransaction(transaction);
    }
  }
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
