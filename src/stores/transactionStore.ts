import { ref, type Ref } from 'vue';

import {
  clear,
  createTable,
  first,
  insert,
  many,
  remove,
  update,
  watch
} from 'blinkdb';

import { useSplitStore } from './splitStore';
import { useAccountStore } from './accountStore';
import { useBlinkDB } from './blinkdb';

let transactionStore: TransactionStore | null = null;

export const useTransactionStore = (): TransactionStore => {
  if (!transactionStore) transactionStore = new TransactionStore();
  return transactionStore;
};

export function resetTransactionStore(): void {
  transactionStore = null;
}

class TransactionStore {
  private splitStore = useSplitStore();
  private accountStore = useAccountStore();

  private db = useBlinkDB();
  private transactionsTable = createTable<Transaction>(
    this.db,
    'transactions'
  )();

  public readonly currentAccountId: Ref<number | null> = ref(null);
  public readonly allTransactionsFetched = ref(false);

  public async reset(): Promise<void> {
    await clear(this.transactionsTable);
    this.currentAccountId.value = null;
    this.allTransactionsFetched.value = false;

    await this.splitStore.reset();
  }

  public async getById(transactionId: number): Promise<Transaction | null> {
    return await first(this.transactionsTable, {
      where: {
        id: transactionId
      }
    });
  }

  public async getByAccountId(accountId: number): Promise<Array<Transaction>> {
    const splits = await this.splitStore.query({
      where: {
        destAccountId: accountId
      }
    });

    return many(this.transactionsTable, {
      where: {
        id: {
          in: splits.map((s) => s.transactionId)
        }
      }
    });
  }

  public async getSortedByDate(): Promise<Array<Transaction>> {
    return many(this.transactionsTable, {
      sort: {
        key: 'date',
        order: 'desc'
      }
    });
  }

  public watchAll(
    callback: (transactions: Array<Transaction>) => void
  ): Promise<{
    stop: () => void;
  }> {
    return watch(
      this.transactionsTable,
      {
        sort: {
          key: 'date',
          order: 'desc'
        }
      },
      callback
    );
  }

  public watchForId(
    transactionId: number,
    callback: (transaction: Transaction) => void
  ): Promise<{
    stop: () => void;
  }> {
    return watch(
      this.transactionsTable,
      {
        where: {
          id: transactionId
        }
      },
      (transactions) => {
        const transaction = transactions[0];
        if (transaction) callback(transaction);
      }
    );
  }

  public async insertTransactions(
    transactions: Array<Transaction>
  ): Promise<void> {
    for (const transaction of transactions) {
      await this.insertTransaction(transaction);
    }
  }

  public async insertTransaction(transaction: Transaction): Promise<void> {
    const splitStore = this.splitStore;
    const accountStore = this.accountStore;

    const transactionProxy = new Proxy(transaction, {
      set(target, p, value): boolean {
        const oldDate = target.date;

        if (p === 'date') {
          void splitStore.getByTransactionId(target.id).then((splits) => {
            for (const split of splits) {
              accountStore.addValue({
                accountId: split.destAccountId,
                value: -split.value,
                date: oldDate
              });
              accountStore.addValue({
                accountId: split.destAccountId,
                value: split.value,
                date: value
              });
            }
          });
        }

        target[p] = value;

        return true;
      }
    });

    if (
      await first(this.transactionsTable, {
        where: { id: transactionProxy.id }
      })
    ) {
      await update(this.transactionsTable, transactionProxy);
    } else {
      await insert(this.transactionsTable, transactionProxy);
    }
  }

  public async deleteTransaction(transactionId: number): Promise<void> {
    await remove(this.transactionsTable, { id: transactionId });
  }
}

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;
};
