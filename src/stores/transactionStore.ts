import { computed, ref, type Ref } from 'vue';

import { defineStore } from 'pinia';

import { useSplitStore } from './splitStore';
import { useAccountStore } from './accountStore';

export const useTransactionStore = defineStore('transactionStore', () => {
  const splitStore = useSplitStore();
  const accountStore = useAccountStore();

  const transactions: Ref<Array<Transaction>> = ref([]);
  const currentAccountId: Ref<number|null> = ref(null);
  const allTransactionsFetched = ref(false);

  const transactionIndex: Map<number, number> = new Map();

  function $reset(): void {
    transactions.value = [];
    currentAccountId.value = null;
    allTransactionsFetched.value = false;

    transactionIndex.clear();
  }

  const getById = computed(() => {
    return (transactionId: number): Transaction|undefined => {
      const index = getIndex(transactionId);
      return index ? transactions.value[index] : undefined;
    };
  });

  const getByAccountId = computed(() => {
    return (accountId: number): Array<Transaction> =>
      sortedByDate.value.filter((t) => {
        const splits = splitStore.getByTransactionId(t.id);
        return (
          splits.length &&
          splits.some((s) => s.destAccountId === accountId)
        );
      });
  });

  const sortedByDate = computed(() => {
    return transactions.value.slice().sort((a, b) => {
      if (b.date.getTime() === a.date.getTime()) {
        return b.timestampAdded - a.timestampAdded;
      }

      return b.date.getTime() - a.date.getTime();
    });
  });

  function getIndex(transactionId: number): number|undefined {
    return transactionIndex.get(transactionId);
  }

  function insertTransactions(transactions: Array<Transaction>): void {
    for (const transaction of transactions) {
      insertTransaction(transaction);
    }
  }

  function insertTransaction(transaction: Transaction): void {
    const transactionProxy = new Proxy(
      transaction,
      {
        set(target, p, value, receiver): boolean {
          console.warn('TRANSACTION PROXY -->', target, p, value, receiver);

          const splits = splitStore.getByTransactionId(target.id);

          if (p === 'date') {
            for (const split of splits) {
              accountStore.addSummaryValue(
                split.destAccountId,
                -split.value,
                target.date
              );
              accountStore.addSummaryValue(
                split.destAccountId,
                split.value,
                value
              );
            }
          }

          target[p] = value;

          return true;
        }
      }
    );

    const index = getIndex(transactionProxy.id);
    if (index) {
      transactions.value.splice(index, 1, transactionProxy);
    } else {
      const length = transactions.value.push(transactionProxy);
      transactionIndex.set(transactionProxy.id, length - 1);
    }
  }

  function deleteTransaction(transactionId: number): void {
    const index = getIndex(transactionId);
    if (index) {
      transactions.value.splice(index, 1);
      transactionIndex.delete(transactionId);
    }
  }

  return {
    $reset,

    currentAccountId: currentAccountId,
    allTransactionsFetched: allTransactionsFetched,

    getById,
    getByAccountId,
    sortedByDate,

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
