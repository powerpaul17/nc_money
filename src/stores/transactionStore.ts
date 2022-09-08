import dayjs from 'dayjs';
import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import { defineStore } from 'pinia';

import { createSplitFromResponseData, useSplitStore } from './splitStore';

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
    ) {
      const response = await axios.get(
        generateUrl('apps/money/transactions/get-transactions-for-account'),
        {
          params: {
            accountId: accountId,
            resultOffset: offset,
            resultLimit: limit
          }
        }
      );

      return response.data.map(createTransactionFromResponseData);
    },
    async fetchUnbalancedTransactions(offset = 0, limit = 100) {
      const response = await axios.get(
        generateUrl('apps/money/transactions/get-unbalanced-transactions'),
        {
          params: {
            resultOffset: offset,
            resultLimit: limit
          }
        }
      );

      return response.data.map(createTransactionFromResponseData);
    },
    insertTransactions(transactions: Array<Transaction>) {
      for (const transaction of transactions) {
        this.transactions.set(transaction.id, transaction);
      }
    },

    // -- TRANSACTIONS --

    async addTransaction(transaction: TransactionCreationData) {
      const data = {
        ...transaction,
        date: dayjs(transaction.date).format('YYYY-MM-DD')
      };

      const response = await axios.post(
        generateUrl('apps/money/transactions'),
        data
      );

      const newTransaction = createTransactionFromResponseData(response.data);
      this.transactions.set(newTransaction.id, newTransaction);

      return newTransaction;
    },
    async updateTransaction(transaction: Transaction) {
      const data = {
        ...transaction,
        date: dayjs(transaction.date).format('YYYY-MM-DD')
      };

      await axios.put(
        generateUrl(`apps/money/transactions/${transaction.id}`),
        data
      );
    }
  }
});

function createTransactionFromResponseData(data): Transaction {
  const splitStore = useSplitStore();

  if (data.splits) {
    const splits = data.splits.map(createSplitFromResponseData);
    splitStore.insertSplits(splits);
  }

  return {
    id: data.id,
    description: data.description,
    date: new Date(data.date),
    timestampAdded: new Date(data.timestampAdded).valueOf()
  };
}

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

type TransactionCreationData = Omit<Transaction, 'id' | 'timestampAdded'>;
