import dayjs from 'dayjs';
import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import { defineStore } from 'pinia';

import { useAccountStore } from './accountStore';

export const useTransactionStore = defineStore('transaction', {
  state: (): State => ({
    transactions: [],
    currentAccountId: null,
    allTransactionsFetched: false
  }),
  getters: {
    getById: (state) => {
      return (transactionId: number) =>
        state.transactions.find((t) => t.id === transactionId);
    },
    sortedByDate: (state) => {
      return state.transactions.sort((a, b) => {
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
      await this.fetchTransactions();
    },
    async fetchTransactions(offset = 0, limit = 100) {
      if (this.allTransactionsFetched) return;

      if (this.currentAccountId) {
        await this.fetchTransactionsOfAccount(
          this.currentAccountId,
          offset,
          limit
        );
      } else {
        await this.fetchUnbalancedTransactions(offset, limit);
      }
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

      const transactions = response.data.map(createTransactionFromResponseData);
      this.insertTransactions(offset, transactions);

      if (transactions.length < limit) this.allTransactionsFetched = true;
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
      const transactions = response.data.map(createTransactionFromResponseData);
      this.insertTransactions(offset, transactions);

      if (transactions.length < limit) this.allTransactionsFetched = true;
    },
    insertTransactions(offset: number, transactions: Array<Transaction>) {
      if (offset > this.transactions.length)
        throw new Error('cannot insert transactions without preceding ones');

      this.transactions.splice(offset, transactions.length, ...transactions);
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
      this.transactions.push(newTransaction);

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
    },

    // -- SPLITS --

    async updateSplit(split: Split) {
      await axios.put(generateUrl(`apps/money/splits/${split.id}`), split);
    },
    async addSplit(split: SplitCreationData) {
      const transaction = this.getById(split.transactionId);
      if (!transaction) throw new Error('transaction does not exist');

      const response = await axios.post(
        generateUrl('apps/money/splits'),
        split
      );

      const newSplit = createSplitFromResponseData(response.data);
      transaction.splits.push(newSplit);

      this.addValueToAccount(split.destAccountId, split.value);
    },
    async deleteSplit(split: Split) {
      const transaction = this.getById(split.transactionId);
      if (!transaction) throw new Error('transaction does not exist');

      await axios.delete(generateUrl(`apps/money/splits/${split.id}`));

      const index = transaction.splits.findIndex((s) => s.id === split.id);
      transaction.splits.splice(index, 1);

      this.addValueToAccount(split.destAccountId, -split.value);
    },

    // -- ACCOUNT VALUES --

    addValueToAccount(accountId: number, value: number) {
      const accountStore = useAccountStore();
      accountStore.addValue(accountId, value);
    }
  }
});

function createTransactionFromResponseData(data): Transaction {
  return {
    id: data.id,
    description: data.description,
    date: new Date(data.date),
    timestampAdded: new Date(data.timestampAdded).valueOf(),
    splits: data.splits?.map(createSplitFromResponseData) ?? []
  };
}

function createSplitFromResponseData(data): Split {
  return new Proxy(
    {
      id: data.id,
      transactionId: data.transactionId,
      destAccountId: data.destAccountId,
      description: data.description,
      value: data.value,
      convertRate: data.convertRate
    },
    {
      set(target, p, value, receiver) {
        const accountStore = useAccountStore();

        if (p === 'value') {
          const diff = value - target.value;
          accountStore.addValue(target.destAccountId, diff);
        } else if (p === 'destAccountId') {
          accountStore.addValue(target.destAccountId, -target.value);
          accountStore.addValue(value, target.value);
        }

        target[p] = value;

        return true;
      }
    }
  );
}

type State = {
  transactions: Array<Transaction>;
  currentAccountId?: number | null;
  allTransactionsFetched: boolean;
};

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;
  splits: Array<Split>;
};

type TransactionCreationData = Omit<
  Transaction,
  'id' | 'timestampAdded' | 'splits'
>;

export type Split = {
  id: number;
  description: string;
  transactionId: number;
  destAccountId: number;
  value: number;
  convertRate: number;
};

type SplitCreationData = Omit<Split, 'id'>;
