import { defineStore } from 'pinia';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';
import {
  useSplitApiService,
  type SplitCreationData
} from '../services/splitApiService';

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
      const splitApiService = useSplitApiService();
      await splitApiService.updateSplit(split);
    },
    async addSplit(split: SplitCreationData, addToStore = true) {
      const splitApiService = useSplitApiService();

      const newSplit = await splitApiService.addSplit(split);

      if (addToStore) {
        this.splits.set(newSplit.id, newSplit);

        const transactionStore = useTransactionStore();
        const transaction = transactionStore.getById(newSplit.transactionId);

        this.addValueToAccount(
          split.destAccountId,
          split.value,
          transaction?.date
        );
      }

      return newSplit;
    },
    async deleteSplit(split: Split) {
      const splitApiService = useSplitApiService();
      await splitApiService.deleteSplit(split.id);

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
