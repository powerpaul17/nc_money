import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

export const useSplitStore = defineStore('splitStore', () => {
  const _splits: Map<number, Split> = reactive(new Map());

  const getById = computed(() => {
    return (splitId: number) => _splits.get(splitId);
  });

  const getByTransactionId = computed(() => {
    return (transactionId: number) => {
      return splitArray.value.filter((s) => s.transactionId === transactionId);
    };
  });

  const getByAccountId = computed(() => {
    return (accountId: number) => {
      return splitArray.value.filter((s) => s.destAccountId === accountId);
    };
  });

  const splitArray = computed(() => {
    return Array.from(_splits.values());
  });

  function insertSplit(split: Split) {
    _splits.set(split.id, split);
  }

  function insertSplits(splits: Array<Split>) {
    for (const split of splits) {
      insertSplit(split);
    }
  }

  function deleteSplit(splitId: number) {
    _splits.delete(splitId);
  }

  return {
    getById,
    getByTransactionId,
    getByAccountId,

    insertSplit,
    insertSplits,
    deleteSplit
  };
});

export type Split = {
  id: number;
  description: string;
  transactionId: number;
  destAccountId: number;
  value: number;
  convertRate: number;
};
