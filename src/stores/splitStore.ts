import { computed, reactive } from 'vue';

import { defineStore } from 'pinia';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';

export const useSplitStore = defineStore('splitStore', () => {
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();

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
    const splitProxy = new Proxy(
      split,
      {
        set(target, p, value, receiver) {
          console.warn('SPLIT PROXY -->', target, p, value, receiver);

          const transaction = transactionStore.getById(target.transactionId);

          if (p === 'value') {
            const diff = value - target.value;
            accountStore.addValue(
              target.destAccountId,
              diff,
              transaction?.date
            );
          } else if (p === 'destAccountId') {
            accountStore.addValue(
              target.destAccountId,
              -target.value,
              transaction?.date
            );
            accountStore.addValue(value, target.value);
          }

          target[p] = value;

          return true;
        }
      });

    _splits.set(splitProxy.id, splitProxy);
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
