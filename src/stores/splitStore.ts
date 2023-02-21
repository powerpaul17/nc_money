import { defineStore } from 'pinia';

import { createTable, watch, insert, remove, clear, many, first, update } from 'blinkdb';
import type { Query } from 'blinkdb/dist/query/types';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';
import { useBlinkDB } from './blinkdb';

export const useSplitStore = defineStore('splitStore', () => {
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();

  const db = useBlinkDB();
  const splitsTable = createTable<Split>(db, 'splits')();

  async function reset(): Promise<void> {
    await clear(splitsTable);
  }

  function getById(splitId: number): Promise<Split|null> {
    return first(splitsTable, {
      where: {
        id: splitId
      }
    });
  }

  function watchForTransactionId(
    transactionId: number,
    callback: (splits: Array<Split>) => void
  ): Promise<{
    stop: () => void;
  }> {
    return watch(splitsTable, {
      where: {
        transactionId: transactionId
      }
    }, callback);
  }

  async function query(query: Query<Split, 'id'>): Promise<Array<Split>> {
    return many(splitsTable, query);
  }

  async function getByTransactionId(transactionId: number): Promise<Array<Split>> {
    return many(splitsTable, {
      where: {
        transactionId: transactionId
      }
    });
  }

  async function getByAccountId(accountId: number): Promise<Array<Split>> {
    return many(splitsTable, {
      where: {
        destAccountId: accountId
      }
    });
  }

  async function insertSplit(split: Split): Promise<void> {
    const splitProxy = new Proxy(
      split,
      {
        set(target, p, value): boolean {
          const oldValue = target.value;
          const oldDestAccountId = target.destAccountId;

          void transactionStore.getById(target.transactionId).then((transaction) => {
            if (p === 'value') {
              const diff = value - oldValue;
              accountStore.addValue(
                target.destAccountId,
                diff,
                transaction?.date
              );
            } else if (p === 'destAccountId') {
              accountStore.addValue(
                oldDestAccountId,
                -oldValue,
                transaction?.date
              );
              accountStore.addValue(value, oldValue, transaction?.date);
            }
          });

          target[p] = value;

          return true;
        }
      }
    );

    if (await first(splitsTable, { where: { id: splitProxy.id } })) {
      await update(splitsTable, splitProxy);
    } else {
      await insert(splitsTable, splitProxy);
    }
  }

  async function insertSplits(splits: Array<Split>): Promise<void> {
    for (const split of splits) {
      await insertSplit(split);
    }
  }

  async function deleteSplit(splitId: number): Promise<void> {
    await remove(splitsTable, { id: splitId });
  }

  return {
    reset,
    query,

    getById,
    getByTransactionId,
    getByAccountId,

    watchForTransactionId,

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
