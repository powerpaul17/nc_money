import { computed, ref, type Ref } from 'vue';

import { defineStore } from 'pinia';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';

export const useSplitStore = defineStore('splitStore', () => {
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();

  const splits: Ref<Array<Split>> = ref([]);

  const splitIndex: Map<number, number> = new Map();
  const indicesByTransactionId: Map<number, Set<number>> = new Map();

  function $reset(): void {
    splits.value = [];

    splitIndex.clear();
    indicesByTransactionId.clear();
  }

  const getById = computed(() => {
    return (splitId: number): Split|undefined => {
      const index = getIndex(splitId);
      return index != undefined ? splits.value[index] : undefined;
    };
  });

  const getByTransactionId = computed(() => {
    return (transactionId: number): Array<Split> => {
      const indices = getIndicesByTransactionId(transactionId);
      return indices.map((index) => {
        const split = splits.value[index];
        if (!split) throw new Error(`split with index ${index} not found`);
        return split;
      });
    };
  });

  const getByAccountId = computed(() => {
    return (accountId: number): Array<Split> => {
      return splits.value.filter((s) => s.destAccountId === accountId);
    };
  });

  function getIndex(splitId: number): number|undefined {
    return splitIndex.get(splitId);
  }

  function getIndicesByTransactionId(transactionId: number): Array<number> {
    return Array.from(indicesByTransactionId.get(transactionId)?.values() ?? []);
  }

  function insertSplit(split: Split): void {
    const splitProxy = new Proxy(
      split,
      {
        set(target, p, value, receiver): boolean {
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
            accountStore.addValue(value, target.value, transaction?.date);
          }

          target[p] = value;

          return true;
        }
      });

    const index = insertIntoIndices(splitProxy);
    splits.value.splice(index, 1, split);
  }

  function insertIntoIndices(split: Split): number {
    const index = getIndex(split.id) ?? splits.value.length;

    splitIndex.set(split.id, index);

    const indices = indicesByTransactionId.get(split.transactionId);
    if (indices) {
      indices.add(index);
    } else {
      const set = new Set<number>();
      set.add(index);
      indicesByTransactionId.set(split.transactionId, set);
    }

    return index;
  }

  function deleteFromIndices(splitId: number): number|undefined {
    const index = getIndex(splitId);

    const split = getById.value(splitId);
    if (!split) throw new Error('split not found');

    splitIndex.delete(splitId);

    const indices = indicesByTransactionId.get(split.transactionId);
    if (index != undefined && indices) {
      indices.delete(index);
    }

    return index;
  }

  function insertSplits(splits: Array<Split>): void {
    for (const split of splits) {
      insertSplit(split);
    }
  }

  function deleteSplit(splitId: number): void {
    const index = deleteFromIndices(splitId);
    if(index != undefined) splits.value.splice(index, 1);
  }

  return {
    $reset,

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
