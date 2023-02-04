import { ref, type Ref } from 'vue';

import { clear, createTable, first, insert, many, remove, update, watch } from 'blinkdb';

import { defineStore } from 'pinia';

import { useSplitStore } from './splitStore';
import { useAccountStore } from './accountStore';
import { useBlinkDB } from './blinkdb';

export const useTransactionStore = defineStore('transactionStore', () => {
  const splitStore = useSplitStore();
  const accountStore = useAccountStore();

  const db = useBlinkDB();
  const transactionsTable = createTable<Transaction>(db, 'transactions')();

  const currentAccountId: Ref<number|null> = ref(null);
  const allTransactionsFetched = ref(false);

  async function reset(): Promise<void> {
    await clear(transactionsTable);
    currentAccountId.value = null;
    allTransactionsFetched.value = false;

    await splitStore.reset();
  }

  async function getById(transactionId: number): Promise<Transaction|null> {
    return await first(transactionsTable, {
      where: {
        id: transactionId
      }
    });
  }

  async function getByAccountId(accountId: number): Promise<Array<Transaction>> {
    const splits = await splitStore.query({
      where: {
        destAccountId: accountId
      }
    });

    return many(transactionsTable, {
      where: {
        id: {
          in: splits.map(s => s.transactionId)
        }
      }
    });
  }

  async function getSortedByDate(): Promise<Array<Transaction>> {
    return many(transactionsTable, {
      sort: {
        key: 'date',
        order: 'desc'
      }
    });
  }

  function watchAll(callback: (transactions: Array<Transaction>) => void): Promise<{
    stop: () => void;
  }> {
    return watch(transactionsTable, {
      sort: {
        key: 'date',
        order: 'desc'
      }
    }, callback);
  }

  async function insertTransactions(transactions: Array<Transaction>): Promise<void> {
    for (const transaction of transactions) {
      await insertTransaction(transaction);
    }
  }

  async function insertTransaction(transaction: Transaction): Promise<void> {
    const transactionProxy = new Proxy(
      transaction,
      {
        set(target, p, value): boolean {
          const oldDate = target.date;

          if (p === 'date') {
            void splitStore.getByTransactionId(target.id).then((splits) => {
              for (const split of splits) {
                accountStore.addSummaryValue(
                  split.destAccountId,
                  -split.value,
                  oldDate
                );
                accountStore.addSummaryValue(
                  split.destAccountId,
                  split.value,
                  value
                );
              }
            });
          }

          target[p] = value;

          return true;
        }
      }
    );

    if(await first(transactionsTable, { where: { id: transactionProxy.id } })) {
      await update(transactionsTable, transactionProxy);
    } else {
      await insert(transactionsTable, transactionProxy);
    }
  }

  async function deleteTransaction(transactionId: number): Promise<void> {
    await remove(transactionsTable, { id: transactionId });
  }

  return {
    reset,

    currentAccountId: currentAccountId,
    allTransactionsFetched: allTransactionsFetched,

    getById,
    getByAccountId,
    getSortedByDate,

    watchAll,

    insertTransaction,
    insertTransactions,
    deleteTransaction
  };
});

export type Transaction = {
  id: number;
  description: string;
  date: Date;
  timestampAdded: number;

  // we save this here to keep state used for transaction list item height
  showSplits: boolean;
};
