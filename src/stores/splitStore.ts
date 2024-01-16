import {
  createTable,
  watch,
  insert,
  remove,
  clear,
  many,
  first,
  update
} from 'blinkdb';
import type { Query } from 'blinkdb/dist/query/types';

import { useAccountStore } from './accountStore';
import { useTransactionStore } from './transactionStore';
import { useBlinkDB } from './blinkdb';
import { NumberUtils } from '../utils/numberUtils';

let splitStore: SplitStore | null = null;

export const useSplitStore = (): SplitStore => {
  if (!splitStore) splitStore = new SplitStore();
  return splitStore;
};

export function resetSplitStore(): void {
  splitStore = null;
}

class SplitStore {
  private db = useBlinkDB();
  private splitsTable = createTable<Split>(this.db, 'splits')();

  public async reset(): Promise<void> {
    await clear(this.splitsTable);
  }

  public getById(splitId: number): Promise<Split | null> {
    return first(this.splitsTable, {
      where: {
        id: splitId
      }
    });
  }

  public watchForTransactionId(
    transactionId: number,
    callback: (splits: Array<Split>) => void
  ): Promise<{
    stop: () => void;
  }> {
    return watch(
      this.splitsTable,
      {
        where: {
          transactionId: transactionId
        }
      },
      callback
    );
  }

  public async query(query: Query<Split, 'id'>): Promise<Array<Split>> {
    return many(this.splitsTable, query);
  }

  public async getByTransactionId(
    transactionId: number
  ): Promise<Array<Split>> {
    return many(this.splitsTable, {
      where: {
        transactionId: transactionId
      }
    });
  }

  public async getByAccountId(accountId: number): Promise<Array<Split>> {
    return many(this.splitsTable, {
      where: {
        destAccountId: accountId
      }
    });
  }

  public async insertSplit(split: Split): Promise<void> {
    const accountStore = useAccountStore();
    const transactionStore = useTransactionStore();

    const splitProxy = new Proxy(split, {
      set(target, p, value): boolean {
        const oldValue = target.value;
        const oldDestAccountId = target.destAccountId;

        void transactionStore
          .getById(target.transactionId)
          .then((transaction) => {
            if (p === 'value') {
              if (NumberUtils.areEqual(value, oldValue)) return;

              const diff = value - oldValue;
              accountStore.addValue({
                accountId: target.destAccountId,
                value: diff,
                date: transaction?.date
              });
            } else if (p === 'destAccountId' && value !== oldDestAccountId) {
              accountStore.addValue({
                accountId: oldDestAccountId,
                value: -oldValue,
                date: transaction?.date
              });
              accountStore.addValue({
                accountId: value,
                value: oldValue,
                date: transaction?.date
              });
            }
          });

        target[p] = value;

        return true;
      }
    });

    if (await first(this.splitsTable, { where: { id: splitProxy.id } })) {
      await update(this.splitsTable, splitProxy);
    } else {
      await insert(this.splitsTable, splitProxy);
    }
  }

  public async insertSplits(splits: Array<Split>): Promise<void> {
    for (const split of splits) {
      await this.insertSplit(split);
    }
  }

  public async deleteSplit(splitId: number): Promise<void> {
    await remove(this.splitsTable, { id: splitId });
  }
}

export type Split = {
  id: number;
  description: string;
  transactionId: number;
  destAccountId: number;
  value: number;
  convertRate: number;
};
