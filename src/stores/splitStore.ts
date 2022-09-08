import axios from '@nextcloud/axios';
import { generateUrl } from '@nextcloud/router';
import { defineStore } from 'pinia';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';

export const useSplitStore = defineStore('split', {
  state: (): State => ({
    splits: new Map()
  }),
  getters: {
    getById(state) {
      return (splitId: number) => state.splits.get(splitId);
    },
    getByTransactionId() {
      return (transactionId: number) => {
        return this.splitArray.filter((s) => s.transactionId === transactionId);
      };
    },
    getByAccountId() {
      return (accountId: number) => {
        return this.splitArray.filter((s) => s.destAccountId === accountId);
      };
    },
    splitArray: (state) => {
      return Array.from(state.splits.values());
    }
  },
  actions: {
    insertSplits(splits: Array<Split>) {
      for (const split of splits) {
        this.splits.set(split.id, split);
      }
    },
    async updateSplit(split: Split) {
      await axios.put(generateUrl(`apps/money/splits/${split.id}`), split);
    },
    async addSplit(split: SplitCreationData) {
      const response = await axios.post(
        generateUrl('apps/money/splits'),
        split
      );

      const newSplit = createSplitFromResponseData(response.data);
      this.splits.set(newSplit.id, newSplit);

      const transactionStore = useTransactionStore();
      const transaction = transactionStore.getById(newSplit.transactionId);

      this.addValueToAccount(
        split.destAccountId,
        split.value,
        transaction?.date
      );
    },
    async deleteSplit(split: Split) {
      await axios.delete(generateUrl(`apps/money/splits/${split.id}`));
      this.splits.delete(split.id);

      const transactionStore = useTransactionStore();
      const transaction = transactionStore.getById(split.transactionId);

      this.addValueToAccount(
        split.destAccountId,
        -split.value,
        transaction?.date
      );
    },

    // -- ACCOUNT VALUES --

    addValueToAccount(accountId: number, value: number, date?: Date) {
      const accountStore = useAccountStore();
      accountStore.addValue(accountId, value, date);
    },

    addValueToAccountSummary(accountId: number, value: number, date: Date) {
      const accountStore = useAccountStore();
      accountStore.addSummaryValue(accountId, value, date);
    }
  }
});

export function createSplitFromResponseData(data): Split {
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
        console.warn('SPLIT PROXY -->', target, p, value, receiver);

        const accountStore = useAccountStore();
        const transactionStore = useTransactionStore();

        const transaction = transactionStore.getById(target.transactionId);

        if (p === 'value') {
          const diff = value - target.value;
          accountStore.addValue(target.destAccountId, diff, transaction?.date);
        } else if (p === 'destAccountId') {
          accountStore.addValue(
            target.destAccountId,
            -target.value,
            transaction?.date
          );
          accountStore.addValue(value, target.value, transaction?.date);
        }

        target[p] = value;

        return true;
      }
    }
  );
}

type State = {
  splits: Map<number, Split>;
};

export type Split = {
  id: number;
  description: string;
  transactionId: number;
  destAccountId: number;
  value: number;
  convertRate: number;
};

type SplitCreationData = Omit<Split, 'id'>;
